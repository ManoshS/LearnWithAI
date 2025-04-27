const express = require("express");
const router = express.Router();
const ConnectsController = require("../controllers/ConnectsController");
const { authenticate } = require("../middleware/auth");

router.put("/", ConnectsController.update);
router.get("/getAllConnections/:id", ConnectsController.findAllConnects);
router.get(
  "/getAllConnectionsRequest/:id",
  ConnectsController.findAllConnectsRequest
);
router.post("/addConnection", ConnectsController.add);
router.put("/acceptConnection/:id", ConnectsController.acceptConnection);
router.put("/rejectConnection/:id", ConnectsController.rejectConnection);

module.exports = router;
