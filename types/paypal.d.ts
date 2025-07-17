export {};

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        style?: Record<string, string>;
        createSubscription: (
          data: {
            subscriptionID?: string;
            [key: string]: unknown;
          },
          actions: {
            subscription: {
              create: (details: { plan_id: string }) => Promise<string>;
            };
          }
        ) => Promise<string>;
        onApprove: (data: { subscriptionID: string }) => void;
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}
