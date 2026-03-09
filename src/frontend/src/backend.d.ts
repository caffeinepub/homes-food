import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactRequest {
    id: bigint;
    customerName: string;
    message: string;
    phoneNumber: string;
}
export interface MealPlanRequest {
    id: bigint;
    customerName: string;
    address: string;
    phoneNumber: string;
    planType: string;
}
export interface OrderRequest {
    id: bigint;
    customerName: string;
    deliveryNotes: string;
    itemsRequested: string;
    address: string;
    phoneNumber: string;
}
export interface backendInterface {
    getAllContactRequests(): Promise<Array<ContactRequest>>;
    getAllMealPlanRequests(): Promise<Array<MealPlanRequest>>;
    getAllOrderRequests(): Promise<Array<OrderRequest>>;
    getContactRequest(id: bigint): Promise<ContactRequest | null>;
    getMealPlanRequest(id: bigint): Promise<MealPlanRequest | null>;
    getOrderRequest(id: bigint): Promise<OrderRequest | null>;
    submitContactRequest(customerName: string, phoneNumber: string, message: string): Promise<bigint>;
    submitMealPlanRequest(customerName: string, phoneNumber: string, planType: string, address: string): Promise<bigint>;
    submitOrderRequest(customerName: string, phoneNumber: string, address: string, itemsRequested: string, deliveryNotes: string): Promise<bigint>;
}
