"use strict";
const Joi = require("joi");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const port = 3000;
const shipmentService = require("./services/shipmentService");
const asyncHandler = require("express-async-handler");
app.post("/shipment", asyncHandler(async (req, res, next) => {
    const validationResult = await createShipmentRequestSchema.validateAsync(req.body);
    if (validationResult.error)
        return res.status(400).send(validationResult.error);
    await shipmentService.createShipment(validationResult);
    return res.status(201).send("Created");
}));
app.post("/organization", asyncHandler(async (req, res, next) => {
    const validationResult = await createOrganizationRequestSchema.validateAsync(req.body);
    if (validationResult.error)
        return res.status(400).send(validationResult.error);
    await shipmentService.createOrganization(validationResult);
    return res.status(201).send("Created");
}));
app.get("/shipments/:shipmentId", asyncHandler(async (req, res, next) => {
    let shipmentId = 0;
    try {
        shipmentId = Number(req.params.shipmentId);
    }
    catch (err) {
        return res.status(400).send("Invalid shipmentId");
    }
    const shipment = await shipmentService.getShipment(shipmentId);
    if (!shipment)
        return res.status(404).send(`shipmentId ${shipmentId} not found`);
    return res.status(200).send(shipment);
}));
app.get("/organizations/:organizationId", asyncHandler(async (req, res, next) => {
    const organization = await shipmentService.getOrganization(req.params.organizationId);
    if (!organization)
        return res
            .status(404)
            .send(`organizationId ${req.params.organizationId} not found`);
    return res.status(200).send(organization);
}));
app.get("/shipments/weight/:type", asyncHandler(async (req, res, next) => {
    const unitType = req.params.type;
    if (!["KILOGRAMS", "POUNDS", "OUNCES"].includes(unitType))
        return res
            .status(400)
            .send("Invalid weight unit. Available types: KILOGRAMS, POUNDS, OUNCES");
    const weight = await shipmentService.getTotalWeight(unitType);
    return res.status(200).send({ weight: weight, unit: unitType });
}));
const createOrganizationRequestSchema = Joi.object({
    type: Joi.string(),
    id: Joi.string().required(),
    code: Joi.string().required(),
});
const createShipmentRequestSchema = Joi.object({
    type: Joi.string(),
    referenceId: Joi.string().required(),
    organizations: Joi.array().items(Joi.string()).required(),
    estimatedTimeArrival: Joi.date().optional().allow(null),
    transportPacks: Joi.object({
        nodes: Joi.array().items(Joi.object({
            totalWeight: Joi.object({
                weight: Joi.number().min(0).required(),
                unit: Joi.string().required(),
            }),
        })),
    }),
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    console.error(err);
    res.status(500).send("Something broke!");
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map