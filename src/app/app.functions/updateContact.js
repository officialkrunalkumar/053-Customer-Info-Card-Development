// updateContact.js
const hubspot = require('@hubspot/api-client');

exports.main = async (event) => {
  try {
    // 1) Initialize client
    const accessToken = process.env.PRIVATE_APP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("No private app token in PRIVATE_APP_ACCESS_TOKEN env var.");
    }
    const hubspotClient = new hubspot.Client({ accessToken });

    // 2) Pull out parameters
    const { contactId, updatedFields } = event.parameters || {};
    if (!contactId) {
      throw new Error("No contactId passed in parameters.");
    }
    if (!updatedFields) {
      throw new Error("No updatedFields object passed.");
    }

    // Define allowed properties (only these will be sent to HubSpot)
    const allowedProperties = new Set([
      'is_this_a_us_entity_with_us_bank_accounts_',
      'estimated_monthly_expenses',
      'accounting_platform',
      'internal_finance_team',
      'pain_points',
      'timing',
      'how_we_will_win',
      'bill_pay_method',
      'expense_reimbursement_app',
      'pilot_customer_',
      'competitor_contract_end_date',
      'accounting_platform__other_',
      'bill_pay_method__other_',
      'expense_reimbursement_app__other_',
      'competitor_other',
      'company',
      'industry',
      'primary_zeni_user_email',
      'ae_source',
      'revenue_type',
      'runway',
      'annualrevenue',
      'estimated_monthly_expenses',
      'incorporation_type',
      'number_of_employees',
      'number_of_subsidiaries',
      'vc_pe_backed',
      'last_funding_round',
      'last_funding_round_amount',
      'finance_point_of_contact_email',
      'bank_s_',
      'credit_card_s_',
      'number_of_vendor_bills_processed_monthly',
      'cap_table_management',
      'cap_table_management__other_',
      'revenue_recognition_process',
      'cash_or_accrual_method',
      'payroll_service_provider',
      'payroll_service_provider__other_',
      'number_of_contractors',
      'entity_consolidation_required',
      'manufacturing_company',
      'managing_inventory_status',
      'number_of_registered_sales_tax_states',
      'number_of_warehouses__3pls__utilized',
      'current_ecommerce_platform_s_',
      'current_ecommerce_platform__other_',
      'automated_inventory_management_platform',
      'automated_inventory_management_platform__other_',
      'number_of_skus',
      'number_of_ap_bills_processed_monthly',
      'sales_tax_remittance_process'
    ]);

    // 3) Prepare properties for HubSpot
    const properties = {};

    Object.entries(updatedFields).forEach(([propName, val]) => {
      // Skip any property not in the allowed list
      if (!allowedProperties.has(propName)) {
        return;
      }
      if (propName === "competitor_contract_end_date" && val) {
        let timestamp;
        // If the value is an object with { year, month, date }
        if (
          typeof val === "object" &&
          val.year != null &&
          typeof val.month === "number" &&
          val.date != null
        ) {
          const d = new Date(Date.UTC(val.year, val.month, val.date));
          timestamp = d.getTime();
        } else if (typeof val === "string") {
          // If the value is a string in "MM/DD/YYYY" format
          const parts = val.split("/");
          if (parts.length === 3) {
            const [mm, dd, yyyy] = parts;
            const month = parseInt(mm, 10) - 1; // convert to 0-indexed month
            const day = parseInt(dd, 10);
            const year = parseInt(yyyy, 10);
            const d = new Date(Date.UTC(year, month, day));
            timestamp = d.getTime();
          }
        }
        properties[propName] = timestamp ? String(timestamp) : "";
      } else {
        properties[propName] = val || "";
      }
    });

    // 4) Update the contact record in HubSpot
    await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });

    return {
      success: true,
      message: `Contact ${contactId} updated successfully.`,
    };
  } catch (err) {
    console.error("Error in updateContact:", err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};
