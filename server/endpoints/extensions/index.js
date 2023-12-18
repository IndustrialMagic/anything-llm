const { Telemetry } = require("../../models/telemetry");
const {
  forwardExtensionRequest,
} = require("../../utils/files/documentProcessor");
const {
  flexUserRoleValid,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");

function extensionEndpoints(app) {
  if (!app) return;

  app.post(
    "/ext/github/branches",
    [validatedRequest, flexUserRoleValid],
    async (request, response) => {
      try {
        const responseFromProcessor = await forwardExtensionRequest({
          endpoint: "/ext/github-repo/branches",
          method: "POST",
          body: request.body,
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/github/repo",
    [validatedRequest, flexUserRoleValid],
    async (request, response) => {
      const { body } = request;
      if (!body.repo || !body.accessToken || !body.branch) {
        return response.status(400).json({ error: 'Invalid input' });
      }
      const responseFromProcessor = await forwardExtensionRequest({
        endpoint: "/ext/github-repo",
        method: "POST",
        body: request.body,
      });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { extensionEndpoints };
