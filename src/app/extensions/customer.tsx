import React, { useState, useEffect } from 'react';
import {
  hubspot,
  Form,
  Select,
  Input,
  Button,
  Heading,
  Tile,
  Flex,
  NumberInput,
  DateInput,
  Text,
  Divider,
  MultiSelect,
  TextArea,
  Icon,
} from '@hubspot/ui-extensions';

// IMPORTANT: Ensure you pin it to a CONTACT record
hubspot.extend<'crm.record.tab'>(({ actions }) => <Extension actions={actions} />);

const Extension = ({ actions }) => {
  const [contactId, setContactId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Reuse the dots state only for loading.
  const [dots, setDots] = useState("");

  // Store dropdown options by property name
  const [optionsMap, setOptionsMap] = useState<
    Record<string, { label: string; value: string }[]>
  >({});

  // Field values for our properties plus extra fields for 'Other' values
  const [formData, setFormData] = useState<Record<string, any>>({
    is_this_a_us_entity_with_us_bank_accounts_: '',
    estimated_monthly_expenses: '',
    accounting_platform: '',
    internal_finance_team: '',
    pain_points: '',
    timing: '',
    how_we_will_win: '',
    bill_pay_method: '',
    expense_reimbursement_app: '',
    pilot_customer_: '',
    competitor_contract_end_date: '',
    accounting_platform__other_: '',
    bill_pay_method__other_: '',
    expense_reimbursement_app__other_: '',
    competitor_other: '',
    company: '',
    industry: '',
    primary_zeni_user_email: '',
    ae_source: '',
    revenue_type: '',
    runway: '',
    annualrevenue: '',
    incorporation_type: '',
    number_of_employees: '',
    number_of_subsidiaries: '',
    vc_pe_backed: '',
    last_funding_round: '',
    last_funding_round_amount: '',
    finance_point_of_contact_email: '',
    bank_s_: '',
    credit_card_s_: '',
    number_of_vendor_bills_processed_monthly: '',
    cap_table_management: '',
    cap_table_management__other_: '',
    revenue_recognition_process: '',
    cash_or_accrual_method: '',
    payroll_service_provider: '',
    payroll_service_provider__other_: '',
    number_of_contractors: '',
    entity_consolidation_required: '',
    manufacturing_company: '',
    managing_inventory_status: '',
    number_of_registered_sales_tax_states: '',
    number_of_warehouses__3pls__utilized: '',
    current_ecommerce_platform_s_: '',
    current_ecommerce_platform__other_: '',
    automated_inventory_management_platform: '',
    automated_inventory_management_platform__other_: '',
    number_of_skus: '',
    number_of_ap_bills_processed_monthly: '',
    sales_tax_remittance_process: '',
  });

  // For testing, define a hard-coded test date.
  const testdate = { year: 2025, month: 2, date: 19 };

  /**
   * 1) Fetch hs_object_id from the record
   */
  useEffect(() => {
    actions.fetchCrmObjectProperties(['hs_object_id']).then((props) => {
      if (props.hs_object_id) {
        setContactId(props.hs_object_id);
      } else {
        console.error('No hs_object_id found. Are you sure this is a contact record?');
      }
      setIsLoading(false);
    });
  }, [actions]);

  /**
   * 2) Once we have contactId, fetch field definitions + current values
   */
  useEffect(() => {
    if (!contactId) return;
    setIsLoading(true);

    hubspot
      .serverless('getContactFields', {
        parameters: {
          contactId,
          propertyNames: [
            'is_this_a_us_entity_with_us_bank_accounts_',
            'estimated_monthly_expenses',
            'accounting_platform',
            'accounting_platform__other_',
            'internal_finance_team',
            'pain_points',
            'timing',
            'how_we_will_win',
            'bill_pay_method',
            'bill_pay_method__other_',
            'expense_reimbursement_app',
            'expense_reimbursement_app__other_',
            'pilot_customer_',
            'competitor_contract_end_date',
            'competitor_other',
            'company',
            'industry',
            'primary_zeni_user_email',
            'ae_source',
            'revenue_type',
            'runway',
            'annualrevenue',
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
          ],
        },
      })
      .then((res) => {
        if (!res.success) {
          console.error('Error from getContactFields:', res.error);
          setIsLoading(false);
          return;
        }

        const { currentValues, optionsMap } = res;

        if (
          currentValues.internal_finance_team &&
          typeof currentValues.internal_finance_team === 'string'
        ) {
          currentValues.internal_finance_team = currentValues.internal_finance_team
            .split(';')
            .map((item) => item.trim())
            .filter((item) => item);
        }

        if (
          currentValues.revenue_type &&
          typeof currentValues.revenue_type === 'string'
        ) {
          currentValues.revenue_type = currentValues.revenue_type
            .split(';')
            .map((item) => item.trim())
            .filter((item) => item);
        }

        if (
          currentValues.current_ecommerce_platform_s_ &&
          typeof currentValues.current_ecommerce_platform_s_ === 'string'
        ) {
          currentValues.current_ecommerce_platform_s_ = currentValues.current_ecommerce_platform_s_
            .split(';')
            .map((item) => item.trim())
            .filter((item) => item);
        }

        if (
          currentValues.managing_inventory_status &&
          typeof currentValues.managing_inventory_status === 'string'
        ) {
          currentValues.managing_inventory_status = currentValues.managing_inventory_status
            .split(';')
            .map((item) => item.trim())
            .filter((item) => item);
        }

        setFormData((prev) => ({
          ...prev,
          ...currentValues,
          competitor_contract_end_date: currentValues.competitor_contract_end_date || testdate,
        }));
        setOptionsMap(optionsMap || {});
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching contact fields:', err);
        setIsLoading(false);
      });
  }, [contactId]);

  /**
   * Update formData in state
   */
  const handleFieldChange = (propertyName, newValue) => {
    setFormData((prev) => ({ ...prev, [propertyName]: newValue }));
  };

  /**
   * 3) On submit, update the contact record.
   */
  const handleSubmit = () => {
    if (!contactId) {
      console.error('No contactId found; cannot update');
      return;
    }

    setIsSaving(true);

    // Process fields before submission.
    const processedFields = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (key === 'internal_finance_team' && Array.isArray(value)) {
          acc[key] = value.join(';');
        } else if (key === 'revenue_type' && Array.isArray(value)) {
          acc[key] = value.join(';');
        } else if (key === 'current_ecommerce_platform_s_' && Array.isArray(value)) {
          acc[key] = value.join(';');
        } else if (key === 'managing_inventory_status' && Array.isArray(value)) {
          acc[key] = value.join(';');
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    hubspot
      .serverless('updateContact', {
        parameters: {
          contactId,
          updatedFields: processedFields,
        },
      })
      .then((res) => {
        setIsSaving(false);
        if (res.success) {
          console.log('Contact updated successfully!', res);
          actions.refreshObjectProperties();
        } else {
          console.error('Failed to update contact:', res.error);
        }
      })
      .catch((err) => {
        setIsSaving(false);
        console.error('Error calling updateContact:', err);
      });
  };

  // Animate the dots only while loading.
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
    } else {
      setDots("");
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <Tile>
        <Text>Loading contact data{dots}</Text>
      </Tile>
    );
  }

  return (
    <>
      {/* Lead Information */}
      <Tile>
        <Flex direction="column" gap="sm">
          <Heading>Lead Information</Heading>
          <Text variant="microcopy">This section must be completed by BDRs.</Text>
          <Divider />
          <Form onSubmit={handleSubmit}>
            <Flex direction="row" gap="sm">
              <Flex direction="column" gap="sm">
                <Select
                  label="US Entity with US Bank Accounts?"
                  name="is_this_a_us_entity_with_us_bank_accounts_"
                  options={optionsMap.is_this_a_us_entity_with_us_bank_accounts_ || []}
                  value={formData.is_this_a_us_entity_with_us_bank_accounts_}
                  onChange={(val) =>
                    handleFieldChange('is_this_a_us_entity_with_us_bank_accounts_', val)
                  }
                />

                <Select
                  label="Accounting Platform"
                  name="accounting_platform"
                  options={optionsMap.accounting_platform || []}
                  value={formData.accounting_platform}
                  onChange={(val) => handleFieldChange('accounting_platform', val)}
                />
                {formData.accounting_platform &&
                  formData.accounting_platform.toLowerCase() === 'other' && (
                    <Input
                      label="Accounting Platform (Other)"
                      name="accounting_platform__other_"
                      value={formData.accounting_platform__other_}
                      onChange={(val) => handleFieldChange('accounting_platform__other_', val)}
                    />
                  )}

                <Select
                  label="Timing"
                  name="timing"
                  options={optionsMap.timing || []}
                  value={formData.timing}
                  onChange={(val) => handleFieldChange('timing', val)}
                />

                {formData.pilot_customer_ &&
                  formData.pilot_customer_.toLowerCase() === 'other' && (
                    <Input
                      label="Competitor (Other)"
                      name="competitor_other"
                      value={formData.competitor_other}
                      onChange={(val) =>
                        handleFieldChange('competitor_other', val)
                      }
                    />
                  )}

                <Select
                  label="Bill Pay Method"
                  name="bill_pay_method"
                  options={optionsMap.bill_pay_method || []}
                  value={formData.bill_pay_method}
                  onChange={(val) => handleFieldChange('bill_pay_method', val)}
                />
                {formData.bill_pay_method &&
                  formData.bill_pay_method.toLowerCase() === 'other' && (
                    <Input
                      label="Bill Pay Method (Other)"
                      name="bill_pay_method__other_"
                      value={formData.bill_pay_method__other_}
                      onChange={(val) => handleFieldChange('bill_pay_method__other_', val)}
                    />
                  )}

                <TextArea
                  label="Pain Points"
                  name="pain_points"
                  value={formData.pain_points}
                  onChange={(val) => handleFieldChange('pain_points', val)}
                />
              </Flex>

              <Flex direction="column" gap="sm">
                <NumberInput
                  label="Estimated Monthly Expenses"
                  name="estimated_monthly_expenses"
                  placeholder="$"
                  precision={2}
                  value={formData.estimated_monthly_expenses}
                  onChange={(val) => handleFieldChange('estimated_monthly_expenses', val)}
                />

                <MultiSelect
                  label="Finance Team"
                  name="internal_finance_team"
                  options={optionsMap.internal_finance_team || []}
                  value={formData.internal_finance_team}
                  onChange={(val) => handleFieldChange('internal_finance_team', val)}
                />

                <Select
                  label="Competitor"
                  name="pilot_customer_"
                  options={optionsMap.pilot_customer_ || []}
                  value={formData.pilot_customer_}
                  onChange={(val) => handleFieldChange('pilot_customer_', val)}
                />
                {formData.pilot_customer_ &&
                  formData.pilot_customer_.toLowerCase() !== 'none' &&
                  formData.pilot_customer_.trim() !== '' && (
                    <DateInput
                      label="Competitor Contract End Date"
                      name="competitor_contract_end_date"
                      value={formData.competitor_contract_end_date}
                      onChange={(val) =>
                        handleFieldChange('competitor_contract_end_date', val)
                      }
                    />
                  )}

                <Select
                  label="Expense Reimbursement App"
                  name="expense_reimbursement_app"
                  options={optionsMap.expense_reimbursement_app || []}
                  value={formData.expense_reimbursement_app}
                  onChange={(val) => handleFieldChange('expense_reimbursement_app', val)}
                />
                {formData.expense_reimbursement_app &&
                  formData.expense_reimbursement_app.toLowerCase() === 'other' && (
                    <Input
                      label="Expense Reimbursement App (Other)"
                      name="expense_reimbursement_app__other_"
                      value={formData.expense_reimbursement_app__other_}
                      onChange={(val) => handleFieldChange('expense_reimbursement_app__other_', val)}
                    />
                  )}

                <TextArea
                  label="How We Will Win"
                  name="how_we_will_win"
                  value={formData.how_we_will_win}
                  onChange={(val) => handleFieldChange('how_we_will_win', val)}
                />
              </Flex>
            </Flex>
            <Divider />
            <Flex direction="row" justify="end" align="center">
              <Button variant="primary" type="submit" disabled={isSaving}>
                {isSaving ? 'Saving' : 'Save'}
              </Button>
            </Flex>
          </Form>
        </Flex>
      </Tile>

      {/* Business Information */}
      <Tile>
        <Heading>Business Information</Heading>
        <Text variant="microcopy">This section must be completed by AEs.</Text>
        <Divider />
        <Form onSubmit={handleSubmit}>
          <Flex direction="row" gap="sm">
            <Flex direction="column" gap="sm">
              <Input
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={(val) => handleFieldChange('company', val)}
              />

              <Input
                label="Primary Zeni User Email"
                name="primary_zeni_user_email"
                value={formData.primary_zeni_user_email}
                onChange={(val) => handleFieldChange('primary_zeni_user_email', val)}
              />

              <MultiSelect
                label="Revenue Type"
                name="revenue_type"
                options={optionsMap.revenue_type || []}
                value={formData.revenue_type}
                onChange={(val) => handleFieldChange('revenue_type', val)}
              />

              <NumberInput
                label="Annual Revenue"
                name="annualrevenue"
                placeholder="$"
                precision={2}
                value={formData.annualrevenue}
                onChange={(val) => handleFieldChange('annualrevenue', val)}
              />

              <Select
                label="Entity Type"
                name="incorporation_type"
                options={optionsMap.incorporation_type || []}
                value={formData.incorporation_type}
                onChange={(val) => handleFieldChange('incorporation_type', val)}
              />

              <NumberInput
                label="Number of Subsidiaries"
                name="number_of_subsidiaries"
                placeholder="0"
                formatStyle="decimal"
                value={formData.number_of_subsidiaries}
                onChange={(val) => handleFieldChange('number_of_subsidiaries', val)}
              />

              {formData.vc_pe_backed &&
                formData.vc_pe_backed === 'true' && (
                  <Select
                    label="Last Funding Round"
                    name="last_funding_round"
                    options={optionsMap.last_funding_round || []}
                    value={formData.last_funding_round}
                    onChange={(val) =>
                      handleFieldChange('last_funding_round', val)
                    }
                  />
                )}
            </Flex>
            <Flex direction="column" gap="sm">
              <Input
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={(val) => handleFieldChange('industry', val)}
              />

              <Input
                label="AE Source"
                name="ae_source"
                value={formData.ae_source}
                onChange={(val) => handleFieldChange('ae_source', val)}
              />

              <Select
                label="Runway"
                name="runway"
                options={optionsMap.runway || []}
                value={formData.runway}
                onChange={(val) => handleFieldChange('runway', val)}
              />

              <NumberInput
                label="Estimated Monthly Expenses"
                name="estimated_monthly_expenses"
                placeholder="$"
                precision={2}
                value={formData.estimated_monthly_expenses}
                onChange={(val) => handleFieldChange('estimated_monthly_expenses', val)}
              />

              <NumberInput
                label="Number of Employees"
                name="number_of_employees"
                placeholder="0"
                formatStyle="decimal"
                value={formData.number_of_employees}
                onChange={(val) => handleFieldChange('number_of_employees', val)}
              />

              <Select
                label="VC/PE Backed"
                name="vc_pe_backed"
                options={optionsMap.vc_pe_backed || []}
                value={formData.vc_pe_backed}
                onChange={(val) =>
                  handleFieldChange('vc_pe_backed', val)
                }
              />

              {formData.vc_pe_backed &&
                formData.vc_pe_backed === 'true' && (
                  <NumberInput
                    label="Last Funding Round Amount"
                    name="last_funding_round_amount"
                    placeholder="$"
                    precision={2}
                    value={formData.last_funding_round_amount}
                    onChange={(val) => handleFieldChange('last_funding_round_amount', val)}
                  />
                )}
            </Flex>
          </Flex>
          <Divider />
          <Flex direction="row" justify="end" align="center">
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving' : 'Save'}
            </Button>
          </Flex>
        </Form>
      </Tile>

      {/* Financial Operations */}
      <Tile>
        <Heading>Financial Operations</Heading>
        <Text variant="microcopy">This section must be completed by AEs.</Text>
        <Divider />
        <Form onSubmit={handleSubmit}>
          <Flex direction="row" gap="sm">
            <Flex direction="column" gap="sm">
              <Select
                label="Accounting Platform"
                name="accounting_platform"
                options={optionsMap.accounting_platform || []}
                value={formData.accounting_platform}
                onChange={(val) => handleFieldChange('accounting_platform', val)}
              />
              <Input
                label="Bank(s)"
                name="bank_s_"
                value={formData.bank_s_}
                onChange={(val) => handleFieldChange('bank_s_', val)}
              />
              <Select
                label="Bill Pay Method"
                name="bill_pay_method"
                options={optionsMap.bill_pay_method || []}
                value={formData.bill_pay_method}
                onChange={(val) => handleFieldChange('bill_pay_method', val)}
              />
              {formData.bill_pay_method &&
                formData.bill_pay_method.toLowerCase() === 'other' && (
                  <Input
                    label="Bill Pay Method (Other)"
                    name="bill_pay_method__other_"
                    value={formData.bill_pay_method__other_}
                    onChange={(val) => handleFieldChange('bill_pay_method__other_', val)}
                  />
                )}
              <Select
                label="Expense Reimbursement App"
                name="expense_reimbursement_app"
                options={optionsMap.expense_reimbursement_app || []}
                value={formData.expense_reimbursement_app}
                onChange={(val) => handleFieldChange('expense_reimbursement_app', val)}
              />
              {formData.expense_reimbursement_app &&
                formData.expense_reimbursement_app.toLowerCase() === 'other' && (
                  <Input
                    label="Expense Reimbursement App (Other)"
                    name="expense_reimbursement_app__other_"
                    value={formData.expense_reimbursement_app__other_}
                    onChange={(val) => handleFieldChange('expense_reimbursement_app__other_', val)}
                  />
                )}
            </Flex>
            <Flex direction="column" gap="sm">
              <Input
                label="Accounting Platform (Other)"
                name="accounting_platform__other_"
                value={formData.accounting_platform__other_}
                onChange={(val) => handleFieldChange('accounting_platform__other_', val)}
              />
              <Input
                label="Credit Card(s)"
                name="credit_card_s_"
                value={formData.credit_card_s_}
                onChange={(val) => handleFieldChange('credit_card_s_', val)}
              />
              <NumberInput
                label="Number of Vendor Bills Processed Monthly"
                name="number_of_vendor_bills_processed_monthly"
                placeholder="0"
                formatStyle="decimal"
                value={formData.number_of_vendor_bills_processed_monthly}
                onChange={(val) => handleFieldChange('number_of_vendor_bills_processed_monthly', val)}
              />

              <Select
                label="Equity Management Tool"
                name="cap_table_management"
                options={optionsMap.cap_table_management || []}
                value={formData.cap_table_management}
                onChange={(val) => handleFieldChange('cap_table_management', val)}
              />
              {formData.cap_table_management &&
                formData.cap_table_management.toLowerCase() === 'other' && (
                  <Input
                    label="Equity Management Tool (Other)"
                    name="cap_table_management__other_"
                    value={formData.cap_table_management__other_}
                    onChange={(val) => handleFieldChange('cap_table_management__other_', val)}
                  />
                )}
            </Flex>
          </Flex>
          <Divider />
          <Flex direction="row" justify="end" align="center">
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving' : 'Save'}
            </Button>
          </Flex>
        </Form>
      </Tile>

      {/* Revenue Recognition */}
      <Tile>
        <Heading>Revenue Recognition</Heading>
        <Text variant="microcopy">This section must be completed by AEs.</Text>
        <Divider />
        <Form onSubmit={handleSubmit}>
          -            <Input
            label="Revenue Recognition Process"
            name="revenue_recognition_process"
            value={formData.revenue_recognition_process}
            onChange={(val) => handleFieldChange('revenue_recognition_process', val)}
          />
          <Flex direction="row" gap="sm">
            <Flex direction="column" gap="sm">
              <Select
                label="Payroll Service Provider"
                name="payroll_service_provider"
                options={optionsMap.payroll_service_provider || []}
                value={formData.payroll_service_provider}
                onChange={(val) => handleFieldChange('payroll_service_provider', val)}
              />
              {formData.payroll_service_provider &&
                formData.payroll_service_provider.toLowerCase() === 'other' && (
                  <Input
                    label="Payroll Service Provider (Other)"
                    name="payroll_service_provider__other_"
                    value={formData.payroll_service_provider__other_}
                    onChange={(val) => handleFieldChange('payroll_service_provider__other_', val)}
                  />
                )}
              <NumberInput
                label="Number of Contractors"
                name="number_of_contractors"
                placeholder="0"
                formatStyle="decimal"
                value={formData.number_of_contractors}
                onChange={(val) => handleFieldChange('number_of_contractors', val)}
              />
            </Flex>
            <Flex direction="column" gap="sm">
              <Select
                label="Cash or Accrual Method"
                name="cash_or_accrual_method"
                options={optionsMap.cash_or_accrual_method || []}
                value={formData.cash_or_accrual_method}
                onChange={(val) => handleFieldChange('cash_or_accrual_method', val)}
              />
              <Select
                label="Entity Consolidation Required"
                name="entity_consolidation_required"
                options={optionsMap.entity_consolidation_required || []}
                value={formData.entity_consolidation_required}
                onChange={(val) => handleFieldChange('entity_consolidation_required', val)}
              />
            </Flex>
          </Flex>
          <Divider />
          <Flex direction="row" justify="end" align="center">
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving' : 'Save'}
            </Button>
          </Flex>
        </Form>
      </Tile>

      {/* E-Commerce Information */}
      <Tile>
        <Heading>E-Commerce Information</Heading>
        <Text variant="microcopy">This section must be completed by AEs.</Text>
        <Form onSubmit={handleSubmit}>
          <Flex direction="row" gap="sm">
            <Flex direction="column" gap="sm">
              <Select
                label="Manufacturing Company"
                name="manufacturing_company"
                options={optionsMap.manufacturing_company || []}
                value={formData.manufacturing_company}
                onChange={(val) => handleFieldChange('manufacturing_company', val)}
              />
              <NumberInput
                label="Number of Registered Sales Tax States"
                name="number_of_registered_sales_tax_states"
                placeholder="0"
                formatStyle="decimal"
                value={formData.number_of_registered_sales_tax_states}
                onChange={(val) => handleFieldChange('number_of_registered_sales_tax_states', val)}
              />
              <MultiSelect
                label="Current E-Commerce Platform(s)"
                name="current_ecommerce_platform_s_"
                options={optionsMap.current_ecommerce_platform_s_ || []}
                value={formData.current_ecommerce_platform_s_}
                onChange={(val) => handleFieldChange('current_ecommerce_platform_s_', val)}
              />
              <Select
                label="Automated Inventory Platform"
                name="automated_inventory_management_platform"
                options={optionsMap.automated_inventory_management_platform || []}
                value={formData.automated_inventory_management_platform}
                onChange={(val) => handleFieldChange('automated_inventory_management_platform', val)}
              />
            </Flex>
            <Flex direction="column" gap="sm">
              <MultiSelect
                label="Managing Inventory Status"
                name="managing_inventory_status"
                options={optionsMap.managing_inventory_status || []}
                value={formData.managing_inventory_status}
                onChange={(val) => handleFieldChange('managing_inventory_status', val)}
              />
              <NumberInput
                label="Number of Warehouses (3PLs) Utilized"
                name="number_of_warehouses__3pls__utilized"
                placeholder="0"
                formatStyle="decimal"
                value={formData.number_of_warehouses__3pls__utilized}
                onChange={(val) => handleFieldChange('number_of_warehouses__3pls__utilized', val)}
              />
              {Array.isArray(formData.current_ecommerce_platform_s_) &&
                formData.current_ecommerce_platform_s_.some(
                  (v) => v.toLowerCase() === 'other'
                ) && (
                  <Input
                    label="Current E-Commerce Platform (Other)"
                    name="current_ecommerce_platform__other_"
                    value={formData.current_ecommerce_platform__other_}
                    onChange={(val) => handleFieldChange('current_ecommerce_platform__other_', val)}
                  />
                )}
              {formData.automated_inventory_management_platform &&
                formData.automated_inventory_management_platform.toLowerCase() === 'other' && (
                  <Input
                    label="Automated Inventory Platform (Other)"
                    name="automated_inventory_management_platform__other_"
                    value={formData.automated_inventory_management_platform__other_}
                    onChange={(val) =>
                      handleFieldChange('automated_inventory_management_platform__other_', val)
                    }
                  />
                )}
              <NumberInput
                label="Number of AP Bills Processed Monthly"
                name="number_of_ap_bills_processed_monthly"
                placeholder="0"
                formatStyle="decimal"
                value={formData.number_of_ap_bills_processed_monthly}
                onChange={(val) => handleFieldChange('number_of_ap_bills_processed_monthly', val)}
              />
              <NumberInput
                label="Number of SKUs"
                name="number_of_skus"
                placeholder="0"
                formatStyle="decimal"
                value={formData.number_of_skus}
                onChange={(val) => handleFieldChange('number_of_skus', val)}
              />
            </Flex>
          </Flex>
          <TextArea
            label="Sales Tax Remittance Process"
            name="sales_tax_remittance_process"
            value={formData.sales_tax_remittance_process}
            onChange={(val) => handleFieldChange('sales_tax_remittance_process', val)}
          />
          <Divider />
          <Flex direction="row" justify="end" align="center">
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving' : 'Save'}
            </Button>
          </Flex>
        </Form>
      </Tile>
    </>
  );
};

export default Extension;
