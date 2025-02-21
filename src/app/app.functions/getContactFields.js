// getContactFields.js
const hubspot = require("@hubspot/api-client");

exports.main = async (event) => {
  try {
    // 1) Initialize HubSpot client
    const accessToken = process.env.PRIVATE_APP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error(
        "No private app token in PRIVATE_APP_ACCESS_TOKEN env var."
      );
    }
    const hubspotClient = new hubspot.Client({ accessToken });

    // 2) Pull out parameters
    const { contactId, propertyNames } = event.parameters || {};
    if (!contactId) {
      throw new Error("No contactId passed in parameters.");
    }
    if (!Array.isArray(propertyNames) || propertyNames.length === 0) {
      throw new Error("propertyNames must be a non-empty array.");
    }

    // 3) Fetch contact’s current property values
    const contactResponse = await hubspotClient.crm.contacts.basicApi.getById(
      contactId,
      propertyNames
    );

    const currentValues = {};
    propertyNames.forEach((propName) => {
      // Fallback to empty string if the property is missing
      currentValues[propName] = contactResponse.properties[propName] || "";
    });

    // 4) Fetch all property definitions in a single API call
    const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll("contacts");
    const properties = propertiesResponse.results;

    // 5) Build an "optionsMap" for any SELECT-type properties
    const optionsMap = {};
    properties.forEach((propDef) => {
      if (propertyNames.includes(propDef.name) && Array.isArray(propDef.options) && propDef.options.length > 0) {
        optionsMap[propDef.name] = propDef.options.map((opt) => ({
          label: opt.label,
          value: opt.value,
        }));
      } else {
        optionsMap[propDef.name] = [];
      }
    });

    // 6) Transform competitor_contract_end_date to { year, month, date }
    if (currentValues.competitor_contract_end_date) {
      const rawVal = Number(currentValues.competitor_contract_end_date);
      if (!isNaN(rawVal) && rawVal > 0) {
        const d = new Date(rawVal);
        d.setUTCHours(0, 0, 0, 0);
        currentValues.competitor_contract_end_date = {
          year: d.getUTCFullYear(),
          month: d.getUTCMonth(), // zero-based (e.g., March is 2)
          date: d.getUTCDate(),
        };
      } else {
        // If not a valid timestamp, set to null
        currentValues.competitor_contract_end_date = null;
      }
    } else {
      // Ensure we return null instead of an empty string if no value is present
      currentValues.competitor_contract_end_date = null;
    }

    // 7) Return everything back to the React code
    return {
      success: true,
      currentValues,
      optionsMap,
    };
  } catch (err) {
    console.error("Error in getContactFields:", err);
    return {
      success: false,
      error: err.message,
    };
  }
};
