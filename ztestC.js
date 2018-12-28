let request = {
	"receipt-data": "string",
};

let response = {
	status: 0,
	receipt: {
		bundle_id: "string",
		application_version: "string",
		original_application_version: "string",
		receipt_creation_date: "date",
		expiration_date: "date",
		in_app: [
			{
				quantity: "string",
				product_id: "string",
				transaction_id: "string",
				original_transaction_id: "string",
				purchase_date: "dateString",
				original_purchase_date: "dateString",
				expires_date: "dateString",
				expiration_intent: "intString",
				is_in_billing_retry_period: "intString",
				is_trial_period: "string",
				is_in_intro_offer_period: "string",
				cancellation_date: "dateString",
				cancellation_reason: "intString",
				app_item_id: "string",
				version_external_identifier: "string",
				web_order_line_item_id: "string",
				auto_renew_status: "intString",
				auto_renew_product_id: "string",
				price_consent_status: "intString"
			}
		],
	}
};