"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = require('../data');
const createShipment = (request) => {
    return data.saveShipment(request);
};
const getShipment = async (shipmentId) => {
    return await data.retrieveShipment(shipmentId);
};
const createOrganization = (request) => {
    return data.saveOrganization(request);
};
const getOrganization = async (organizationId) => {
    return await data.retrieveOrganization(organizationId);
};
const getTotalWeight = async (unitType) => {
    const totalWeights = await data.retrieveAllTotalWeights();
    let convertedWeights = [];
    switch (unitType) {
        case "KILOGRAMS":
            convertedWeights = convertToKilograms(totalWeights);
            break;
        case "POUNDS":
            convertedWeights = convertToPounds(totalWeights);
            break;
        case "OUNCES":
            convertedWeights = convertToOunces(totalWeights);
            break;
    }
    return convertedWeights.reduce((acc, weight) => acc += weight, 0);
};
const convertToKilograms = (weights) => {
    return weights.map(weight => {
        if (weight.unit === "KILOGRAMS")
            return weight.weight;
        else if (weight.unit === "POUNDS")
            return weight.weight * .4536;
        else if (weight.unit === "OUNCES")
            return weight.weight * .02835;
        throw `Unknown weight unit found: ${weight.unit}`;
    });
};
const convertToPounds = (weights) => {
    return weights.map(weight => {
        if (weight.unit === "POUNDS")
            return weight.weight;
        else if (weight.unit === "OUNCES")
            return weight.weight * .0625;
        else if (weight.unit === "KILOGRAMS")
            return weight.weight * 2.20462;
        throw `Unknown weight unit found: ${weight.unit}`;
    });
};
const convertToOunces = (weights) => {
    return weights.map(weight => {
        if (weight.unit === "OUNCES")
            return weight.weight;
        else if (weight.unit === "POUNDS")
            return weight.weight * 16;
        else if (weight.unit === "KILOGRAMS")
            return weight.weight * 35.274;
        throw `Unknown weight unit found: ${weight.unit}`;
    });
};
module.exports = {
    createShipment, getShipment, createOrganization, getOrganization, getTotalWeight
};
//# sourceMappingURL=shipmentService.js.map