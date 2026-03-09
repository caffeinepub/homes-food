import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";

actor {
  type OrderRequest = {
    id : Nat;
    customerName : Text;
    phoneNumber : Text;
    address : Text;
    itemsRequested : Text;
    deliveryNotes : Text;
  };

  module OrderRequest {
    public func compare(request1 : OrderRequest, request2 : OrderRequest) : Order.Order {
      Nat.compare(request1.id, request2.id);
    };
  };

  type MealPlanRequest = {
    id : Nat;
    customerName : Text;
    phoneNumber : Text;
    planType : Text;
    address : Text;
  };

  module MealPlanRequest {
    public func compare(request1 : MealPlanRequest, request2 : MealPlanRequest) : Order.Order {
      Nat.compare(request1.id, request2.id);
    };
  };

  type ContactRequest = {
    id : Nat;
    customerName : Text;
    phoneNumber : Text;
    message : Text;
  };

  module ContactRequest {
    public func compare(request1 : ContactRequest, request2 : ContactRequest) : Order.Order {
      Nat.compare(request1.id, request2.id);
    };
  };

  let orderRequests = Map.empty<Nat, OrderRequest>();
  let mealPlanRequests = Map.empty<Nat, MealPlanRequest>();
  let contactRequests = Map.empty<Nat, ContactRequest>();

  var nextOrderRequestId = 1 : Nat;
  var nextMealPlanRequestId = 1 : Nat;
  var nextContactRequestId = 1 : Nat;

  public shared ({ caller }) func submitOrderRequest(customerName : Text, phoneNumber : Text, address : Text, itemsRequested : Text, deliveryNotes : Text) : async Nat {
    let id = nextOrderRequestId;
    let orderRequest : OrderRequest = {
      id;
      customerName;
      phoneNumber;
      address;
      itemsRequested;
      deliveryNotes;
    };
    orderRequests.add(id, orderRequest);
    nextOrderRequestId += 1;
    id;
  };

  public shared ({ caller }) func submitMealPlanRequest(customerName : Text, phoneNumber : Text, planType : Text, address : Text) : async Nat {
    let id = nextMealPlanRequestId;
    let mealPlanRequest : MealPlanRequest = {
      id;
      customerName;
      phoneNumber;
      planType;
      address;
    };
    mealPlanRequests.add(id, mealPlanRequest);
    nextMealPlanRequestId += 1;
    id;
  };

  public shared ({ caller }) func submitContactRequest(customerName : Text, phoneNumber : Text, message : Text) : async Nat {
    let id = nextContactRequestId;
    let contactRequest : ContactRequest = {
      id;
      customerName;
      phoneNumber;
      message;
    };
    contactRequests.add(id, contactRequest);
    nextContactRequestId += 1;
    id;
  };

  public query ({ caller }) func getOrderRequest(id : Nat) : async ?OrderRequest {
    orderRequests.get(id);
  };

  public query ({ caller }) func getMealPlanRequest(id : Nat) : async ?MealPlanRequest {
    mealPlanRequests.get(id);
  };

  public query ({ caller }) func getContactRequest(id : Nat) : async ?ContactRequest {
    contactRequests.get(id);
  };

  public query ({ caller }) func getAllOrderRequests() : async [OrderRequest] {
    orderRequests.values().toArray().sort();
  };

  public query ({ caller }) func getAllMealPlanRequests() : async [MealPlanRequest] {
    mealPlanRequests.values().toArray().sort();
  };

  public query ({ caller }) func getAllContactRequests() : async [ContactRequest] {
    contactRequests.values().toArray().sort();
  };
};
