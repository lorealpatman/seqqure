const router = require("express").Router();
const peopleController = require("../controllers/people.controller");
const validateBody = require("../filters/validate.body");
const Person = require("../models/person");

module.exports = router;

// api routes ===========================================================
router.get("/admin", peopleController.getByTenantId);
router.get("/", peopleController.getAll);
router.get("/search", peopleController.search);
router.get("/:id([0-9a-fA-F]{24})", peopleController.getPersonById);
router.post("/", validateBody(Person), peopleController.post);
router.put("/:id([0-9a-fA-F]{24})", validateBody(Person), peopleController.put);
router.delete("/:id([0-9a-fA-F]{24})", peopleController.delete);
router.put("/:id([0-9a-fA-F]{24})/filekey", peopleController.updateFileKey);
