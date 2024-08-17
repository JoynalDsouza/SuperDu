// Define the types for the tab and stack navigators
export type TabParamList = {
  Dashboard: undefined;
  Overview: undefined;
  Transactions: undefined;
  Settings: undefined;
};

export type StackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  Home: undefined;
  ManageTransaction: ManageTransactionParams;
};

export type NavigationParams = Partial<StackParamList & TabParamList>;

export type NavigationActionType =
  | 'navigate'
  | 'replace'
  | 'push'
  | 'reset'
  | 'back';

export type ManageTransactionParams = {
  transactionId?: string;
};
