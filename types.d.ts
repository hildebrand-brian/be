export interface Organization{
    id: string,
    code: string,
}

export interface TransportPacks{
    nodes: [TransportPacksNode]
}

export interface TransportPacksNode {
    totalWeight: Weight
}

export interface Weight {
    weight: number,
    unit: string
}

export interface Shipment{
    referenceId: string,
    organizations: [string],
    estimatedTimeArrival: Datetime,
    transportPacks: TransportPacks
}

export interface ShipmentDto {
    id: number,
    estimatedTimeArrival: Datetime,
    referenceId: string
}

export interface OrganizationDto {
    id: number,
    code: string
}

export interface ShipmentOrganizationDto {
    organizationId: number,
    shipmentId: number
}

export interface ShipmentTransportPackNodeDto {
    id: number,
    shipmentId: number,
    weight: number,
    unit: string
}