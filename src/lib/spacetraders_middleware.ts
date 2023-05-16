import type { Middleware, ResponseContext } from '$api';
import { toastStore } from '@skeletonlabs/skeleton';

export const middleware: Middleware = {
    post: async (context: ResponseContext) => {
        if (!context.response?.ok) {
            let response = await context.response?.json();
            console.log('middleware', response);
            toastStore.trigger({
                message: response?.error.message || 'Unknown error',
            });
        }
    }
};
