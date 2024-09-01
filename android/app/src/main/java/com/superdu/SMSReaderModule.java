package com.superdu; // Replace it with your app-name

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.content.pm.PackageManager;

import androidx.core.content.ContextCompat; // For checking permissions

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.text.SimpleDateFormat;
import java.util.Date;


public class SMSReaderModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public SMSReaderModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;

        registerSMSReceiver();
    }

    @Override
    public String getName() {
        return "SMSReaderModule";
    }

    private void sendEvent(String eventName, String message) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, message);
    }

    private void registerSMSReceiver() {
        BroadcastReceiver smsReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Bundle extras = intent.getExtras();
                if (extras != null) {
                    Object[] pdus = (Object[]) extras.get("pdus");
                    for (Object pdu : pdus) {
                        SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdu);
                        String messageBody = sms.getMessageBody();
                        String senderPhoneNumber = sms.getOriginatingAddress();
                        long timestamp = sms.getTimestampMillis();

                        WritableMap params = Arguments.createMap();
                        params.putString("messageBody", messageBody);
                        params.putString("senderPhoneNumber", senderPhoneNumber);
                        params.putDouble("timestamp", (double) timestamp);

                        String jsonString = params.toString();

                        sendEvent("onSMSReceived", jsonString);
                    }
                }
            }
        };

        IntentFilter filter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
        this.reactContext.registerReceiver(smsReceiver, filter);
    }

    @ReactMethod
    public void startListeningToSMS() {
        registerSMSReceiver();
    }

  @ReactMethod
public void getMessagesFromDateTime(String dateTimeString, Promise promise) {
    try {
        // Check if the READ_SMS permission is granted
        if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_SMS)
            != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "READ_SMS permission is not granted");
            return;
        }

        // Grant URI permission to your app for reading SMS content
        reactContext.grantUriPermission(
            reactContext.getPackageName(), 
            Uri.parse("content://sms/"), 
            Intent.FLAG_GRANT_READ_URI_PERMISSION
        );

        WritableNativeArray smsArray = new WritableNativeArray();

        // Parse the date and time string to a Date object
        SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date dateTime = dateTimeFormat.parse(dateTimeString);

        // Convert the date and time to milliseconds
        long dateTimeInMillis = dateTime.getTime();

        // Define the SMS content URI and the columns to retrieve
        Uri smsUri = Uri.parse("content://sms/inbox");
        String[] projection = new String[]{"address", "body", "date"};

        // Define the selection criteria for messages after the specified date and time
        String selection = "date >= ?";
        String[] selectionArgs = new String[]{String.valueOf(dateTimeInMillis)};

        // Query the SMS content provider
        Cursor cursor = reactContext.getContentResolver().query(smsUri, projection, selection, selectionArgs, "date ASC");

        // Loop through the retrieved SMS messages and add them to the array
        if (cursor != null) {
            while (cursor.moveToNext()) {
                String address = cursor.getString(cursor.getColumnIndex("address"));
                String body = cursor.getString(cursor.getColumnIndex("body"));
                long timestamp = cursor.getLong(cursor.getColumnIndex("date"));

                WritableMap smsMap = new WritableNativeMap();
                smsMap.putString("senderPhoneNumber", address);
                smsMap.putString("messageBody", body);
                smsMap.putDouble("timestamp", (double) timestamp);

                smsArray.pushMap(smsMap);
            }
            cursor.close();
        }

        // Resolve the promise with the SMS array
        promise.resolve(smsArray);
    } catch (Exception e) {
        // Reject the promise in case of an error
        promise.reject("SMS_FETCH_ERROR", e);
    }
}

}
