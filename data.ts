import { OrganizationDto, Organization, Shipment, Weight } from "types";
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "logixboard_be",
    password: "password",
    database: "logixboard_be",
  },
});

const saveShipment = async (shipment: Shipment): Promise<void> => {
  const trx = await knex.transaction();

  await trx
    .from("shipments")
    .where("referenceId", "=", shipment.referenceId)
    .delete();

  const newRootShipment = {
    referenceId: shipment.referenceId,
    estimatedTimeArrival: shipment.estimatedTimeArrival,
  };

  const shipmentId = (
    await trx.insert(newRootShipment, ["id"]).into("shipments")
  )[0].id;

  if (shipment.organizations.length > 0) {
    const existingOrganizations = (await trx("organizations")
      .select("id", "code")
      .whereIn("code", shipment.organizations)) as [OrganizationDto];
    const shipmentOrganizations = existingOrganizations.map((org) => {
      return {
        organizationId: org.id,
        shipmentId: shipmentId,
      };
    });
    if (shipmentOrganizations.length > 0) {
      await trx.insert(shipmentOrganizations).into("shipmentOrganizations");
    }
  }

  const transportPackNodes = shipment.transportPacks.nodes.map((node) => {
    return {
      shipmentId: shipmentId,
      weight: node.totalWeight.weight,
      unit: node.totalWeight.unit,
    };
  });
  if (transportPackNodes.length > 0) {
    await trx.insert(transportPackNodes).into("shipmentTransportPackNodes");
  }
  await trx.commit();
};

const retrieveShipment = async (shipmentId: string): Promise<Shipment> => {
  const shipment = await knex("shipments")
    .where("referenceId", "=", shipmentId)
    .select("id", "referenceId")
    .first();
  const shipmentOrganizations = await knex
    .select("code")
    .from("shipmentOrganizations")
    .join(
      "organizations",
      "shipmentOrganizations.organizationId",
      "organizations.id"
    )
    .where("shipmentOrganizations.id", "=", shipment.id);
  const shipmentTransportPackNodes = await knex
    .select("weight", "unit")
    .from("shipmentTransportPackNodes")
    .where("shipmentId", "=", shipment.id);

  return {
    referenceId: shipment.referenceId,
    organizations: shipmentOrganizations,
    estimatedTimeArrival: shipment.estimatedTimeArrival,
    transportPacks: {
      nodes: shipmentTransportPackNodes,
    },
  };
};

async function saveOrganization(organization: Organization): Promise<void> {
  const existingOrganization = await knex
    .select("id", "code")
    .where("id", "=", organization.id)
    .from("organizations");
  if (existingOrganization.length > 0) {
    const updateResult = await knex
      .where("id", "=", organization.id)
      .update({ code: organization.code })
      .from("organizations");
    console.log(updateResult);
  } else {
    const insertResult = await knex
      .insert({ id: organization.id, code: organization.code })
      .into("organizations");
    console.log(insertResult);
  }
}

const retrieveOrganization = async (
  organizationId: string
): Promise<Organization> => {
  return await knex
    .select("organizationId", "code")
    .where("id", "=", organizationId)
    .from("organizations");
};

const retrieveAllTotalWeights = async (): Promise<Array<Weight>> => {
  return await knex.select("weight", "unit").from("shipmentTransportPackNodes");
};

module.exports = {
  saveShipment,
  retrieveShipment,
  saveOrganization,
  retrieveOrganization,
  retrieveAllTotalWeights,
};
