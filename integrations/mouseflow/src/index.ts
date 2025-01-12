import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type MouseflowRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            website_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: MouseflowRuntimeContext
) => {
    const websiteId = environment.spaceInstallation.configuration.website_id;
    if (!websiteId) {
        throw new Error(
            `The Mouseflow Website ID is missing from the configuration. (ID: ${event.spaceId}).`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', websiteId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<MouseflowRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
