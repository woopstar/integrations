import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './fathomScript.raw.js';

type FathomRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            site_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: FathomRuntimeContext
) => {
    const siteId = environment.spaceInstallation.configuration.site_id;
    if (!siteId) {
        throw new Error(
            `The Fathom site ID is missing from the Space (ID: ${event.installationId}) installation.`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', siteId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<FathomRuntimeContext>({
    events: {
        fetch_published_script: handleFetchEvent,
    },
});