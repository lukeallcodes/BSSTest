import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
export const appConfig = {
    providers: [
        provideRouter(routes),
        provideClientHydration(),
        provideHttpClient(withFetch()),
        // ... other providers ...
    ]
};
//# sourceMappingURL=app.config.js.map