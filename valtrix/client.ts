import { createClient } from '@valtrix/sdk'

/** A logged interaction or note in the sales process: calls, emails, meetings, notes, and stage moves all map here. What it was logged on is polymorphic (subject_id/subject_type: opportunity, customer, contact, or project; reviewer comments and status changes on a permit or job log against the project). Construction document control logs against the project too: requests for information, submittals, transmittals, and correspondence, each with its own kind and the log number in code. Scheduled future work maps to schedule_task; time worked maps to time_entry. Query via valtrix.records.activity.findMany(), write via upsert(). */
export interface ActivityRecord {
    /** What happened */
    note?: string | null
    /** One of: call, email, meeting, note, task, stage_change, rfi, submittal, transmittal, correspondence, other. Map the source activity types onto these (a construction document-control entry keeps its own kind: a request for information is rfi, a submittal package is submittal, a transmittal is transmittal, a logged letter is correspondence); anything else is other with the raw label in source data */
    kind?: string | null
    /** Valtrix record ID of the record the activity was logged on */
    subject_id?: string | null
    /** Entity type of the linked subject record: opportunity, customer, contact, or project */
    subject_type?: string | null
    /** Valtrix record ID of the customer the entry concerns when the subject is something of theirs (a project, an opportunity, an admission); a clinical entry charted on an admission links the admission as subject and the patient here. Sources whose subject is the customer itself leave it empty */
    customer_id?: string | null
    /**
     * When the activity happened
     * ISO 8601 date string.
     */
    occurred_at?: string | null
    /**
     * When the activity was logged in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /** The source's own type or form name for the entry (a note type, an assessment tool, a problem list, a vitals reading), as it labels it; source-defined, pass it through */
    category?: string | null
    /** A coded value the entry carries, as the source prints it (an ICD-10 diagnosis code, a procedure code), for clinical and coded sources */
    code?: string | null
    /** The numeric result the entry records, for scored assessments and measurements */
    score?: number | null
    /** The source's own status or interpretation of the entry (a problem status, an assessment interpretation, an allergy status), as it labels it; source-defined, pass it through */
    outcome?: string | null
    /** Name of the person who recorded or signed the entry, for sources that keep one on it */
    author?: string | null
}

/** A customer's reservation of an event spot, a staff member's time, or a resource: class registrations, appointments, court hires, and desk bookings all map here. Group occurrences link via event_id; the purchase paying for it maps to order and a consumed pack credit to entitlement. Query via valtrix.records.booking.findMany(), write via upsert(). */
export interface BookingRecord {
    /** Customer the booking is for */
    customer_name?: string | null
    /** Valtrix record ID of the customer the booking is for */
    customer_id?: string | null
    /** Valtrix record ID of the event the booking reserves a spot in, for group occurrences */
    event_id?: string | null
    /** Valtrix record ID of the resource the booking reserves, such as a court, room, or desk */
    resource_id?: string | null
    /** Valtrix record ID of the staff member the booking is with, such as the practitioner or stylist */
    employee_id?: string | null
    /** Valtrix record ID of the catalog item for the booked service */
    item_id?: string | null
    /** Valtrix record ID of the location the booking takes place at */
    location_id?: string | null
    /** Valtrix record ID of the order that paid for the booking */
    order_id?: string | null
    /** Valtrix record ID of the entitlement the booking consumed a credit from */
    entitlement_id?: string | null
    /** One of: booked, confirmed, attended, completed, no_show, cancelled, waitlisted. Map the source booking states onto these (an unconfirmed booking is booked) */
    status?: string | null
    /**
     * When the booking starts
     * ISO 8601 date string.
     */
    start_at?: string | null
    /**
     * When the booking ends
     * ISO 8601 date string.
     */
    end_at?: string | null
    /**
     * When the booking was made in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** An internal budget adjustment or transfer that moves budget between lines without a client-facing change order. Contractual changes map to change_order. Query via valtrix.records.budget_change.findMany(), write via upsert(). */
export interface BudgetChangeRecord {
    /** Budget change number */
    number?: string | null
    /** Budget change title */
    title?: string | null
    /** What the budget change covers */
    description?: string | null
    /** One of: draft, pending, approved, rejected, void. Map the source approval states onto these; the raw label stays in source data */
    status?: string | null
    /** Net amount of the change */
    amount?: number | null
    /** Valtrix record ID of the project the budget change belongs to */
    project_id?: string | null
    /**
     * When the budget change was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A computed budget report row per cost code: original, changes, committed, costs to date, projected, and over/under. Read-side rollup only; the budget's raw composition maps to budget_line. Query via valtrix.records.budget_detail.findMany(), write via upsert(). */
export interface BudgetDetailRecord {
    /** Cost code the row is budgeted against */
    cost_code?: string | null
    /** Valtrix record ID of the cost code the row is budgeted against */
    cost_code_id?: string | null
    /** Cost category or division as the source names it; source-defined, pass it through */
    category?: string | null
    /** Valtrix record ID of the project the row is budgeted against */
    project_id?: string | null
    /** Original budgeted amount */
    original_amount?: number | null
    /** Approved budget changes */
    budget_changes?: number | null
    /** Approved change orders */
    approved_cos?: number | null
    /** Pending change orders */
    pending_cos?: number | null
    /** Budget after approved changes */
    revised_amount?: number | null
    /** Committed costs */
    committed_costs?: number | null
    /** Direct costs to date */
    direct_costs?: number | null
    /** Job-to-date costs */
    jtd_costs?: number | null
    /** Projected total costs */
    projected_costs?: number | null
    /** Estimated cost at completion */
    estimated_final?: number | null
    /** Projected over or under budget */
    over_under?: number | null
}

/** A single budgeted row of a project budget: cost code plus original and revised amounts. This is the budget's composition; computed report rollups with committed, to-date, and projected columns map to budget_detail. Query via valtrix.records.budget_line.findMany(), write via upsert(). */
export interface BudgetLineRecord {
    /** Project or job the line is budgeted against */
    project_name?: string | null
    /** Valtrix record ID of the project the line is budgeted against */
    project_id?: string | null
    /** Cost code the line is budgeted against */
    cost_code?: string | null
    /** Valtrix record ID of the cost code the line is budgeted against */
    cost_code_id?: string | null
    /** What the budget line covers */
    description?: string | null
    /** Cost category or division as the source names it; source-defined, pass it through */
    category?: string | null
    /** Cost type as the source names it (labor, material, subcontractor); source-defined, pass it through */
    cost_type?: string | null
    /** Budgeted quantity */
    quantity?: number | null
    /** Budgeted cost per unit */
    unit_cost?: number | null
    /** Original budgeted amount */
    original_amount?: number | null
    /** Revised budget after approved changes */
    revised_amount?: number | null
    /** One of: bill, credit, expense, payroll, card_transaction, invoice, order, estimate, bid_request, prime_contract, subcontract, purchase_order, work_order, requisition, change_order, journal_entry, claim, treatment_plan, other. The canonical kind of the document the line belongs to */
    document_type?: string | null
    /** One of: draft, pending, approved, rejected, void. Approval status of the source document the line belongs to, mapped the same way as that document */
    document_status?: string | null
    /**
     * When the budget line was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** An early-stage record that something changed on a project, captured before or without a priced change order. Once priced and contractual it maps to change_order or commitment_change_order. Query via valtrix.records.change_event.findMany(), write via upsert(). */
export interface ChangeEventRecord {
    /** Change event number */
    number?: string | null
    /** Change event title */
    title?: string | null
    /** What changed and why */
    description?: string | null
    /** One of: in_scope, out_of_scope, tbd. Whether the change is in or out of the contracted scope */
    scope?: string | null
    /** One of: open, pending, closed, void. Map the source change event states onto these (awaiting pricing or sent to client is pending) */
    status?: string | null
    /** Kind of change as the source names it (owner change, design change, weather); source-defined, pass it through */
    change_type?: string | null
    /** Reason for the change as the source names it; source-defined, pass it through */
    change_reason?: string | null
    /** Valtrix record ID of the change order the event became once priced */
    change_order_id?: string | null
    /** Entity type of the linked change order record: change_order or commitment_change_order */
    change_order_type?: string | null
    /** Valtrix record ID of the project the change event belongs to */
    project_id?: string | null
    /**
     * When the change event was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A priced amendment to a client-facing contract, at the header level: construction prime contract change orders, scope or SOW amendments, and lease amendments all land here. Changes against a purchase order or subcontract map to commitment_change_order; unpriced early-stage changes map to change_event. Query via valtrix.records.change_order.findMany(), write via upsert(). */
export interface ChangeOrderRecord {
    /** Change order number */
    number?: string | null
    /** One of: prime, request, package, other. A change order on the owner or prime contract is prime; a change order request or proposed change not yet approved is request; a package that bundles requests for approval is package */
    kind?: string | null
    /** Change order title */
    title?: string | null
    /** One of: draft, pending, approved, rejected, void. Map the source approval states onto these (pricing and review states are pending); the raw label stays in source data */
    status?: string | null
    /** Total value of the change */
    total?: number | null
    /** Valtrix record ID of the client-facing contract the change order belongs to */
    contract_id?: string | null
    /** Valtrix record ID of the project the change order belongs to */
    project_id?: string | null
    /** Whether the change order is executed */
    executed?: boolean | null
    /**
     * When the change order was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A priced amendment to a money-out commitment, linked to its parent via contract_id: subcontract change orders and post-issue purchase order revisions land here. Client-facing changes map to change_order. Query via valtrix.records.commitment_change_order.findMany(), write via upsert(). */
export interface CommitmentChangeOrderRecord {
    /** Change order number */
    number?: string | null
    /** Change order title */
    title?: string | null
    /** One of: draft, pending, approved, rejected, void. Map the source approval states onto these; the raw label stays in source data */
    status?: string | null
    /** Total value of the change */
    total?: number | null
    /** Valtrix record ID of the commitment contract the change order belongs to */
    contract_id?: string | null
    /** Valtrix record ID of the project the change order belongs to */
    project_id?: string | null
    /** Whether the change order is executed */
    executed?: boolean | null
    /**
     * When the change order was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A signed instrument a party must provide before something else may proceed: lien waivers, insurance certificates, tax forms, liability and consent waivers, and staff certifications all collapse here, discriminated by kind. This is the tracked obligation, with its own signature lifecycle, validity window, and signatory; the rendered file rides along as a record attachment. What it gates is identified by subject_type and subject_id, so one shape covers a waiver blocking payment of a vendor invoice (cost), a certificate held against a subcontract or membership (contract), and a liability or consent form a customer signs before a booking. A standing credential belonging to the signing party rather than to any one document leaves subject_id null and is reached through counterparty_id. Query via valtrix.records.compliance_document.findMany(), write via upsert(). */
export interface ComplianceDocumentRecord {
    /** Name of the form or template the document was raised from */
    title?: string | null
    /** One of: lien_waiver, insurance_certificate, tax_form, liability_waiver, consent_form, certification, other. Map the source document types onto these */
    kind?: string | null
    /** One of: pending, signed, declined, expired, released. Where the document sits in its signature lifecycle */
    status?: string | null
    /** Entity type of the record the document gates: cost, contract, or booking */
    subject_type?: string | null
    /** Valtrix record ID of the record this signature gates, null for a standing credential held against the counterparty itself */
    subject_id?: string | null
    /** Vendor, customer, or employee required to sign */
    counterparty?: string | null
    /** Valtrix record ID of the party required to sign */
    counterparty_id?: string | null
    /** Entity type of the linked counterparty record: vendor, customer, or employee */
    counterparty_type?: string | null
    /** Valtrix record ID of the project the document belongs to */
    project_id?: string | null
    /** Valtrix record ID of the location the document belongs to, for sources that hold compliance against a venue or site rather than a project */
    location_id?: string | null
    /** Amount the document covers, which may be a partial release against the gated record total */
    amount?: number | null
    /**
     * Date the document takes effect from
     * ISO 8601 date string.
     */
    effective_at?: string | null
    /**
     * Date the document lapses and must be renewed, for coverage and certifications that expire
     * ISO 8601 date string.
     */
    expires_at?: string | null
    /**
     * When the counterparty signed, null while the document is unsigned
     * ISO 8601 date string.
     */
    signed_at?: string | null
    /** Name of the individual who signed on the counterparty side */
    signed_by_name?: string | null
    /** Role or title of the individual who signed */
    signed_by_title?: string | null
}

/** An individual person at a customer, vendor, or other external party, with their own name and contact details. Not the account itself (customer, vendor) and not the org's own workforce (employee). Query via valtrix.records.contact.findMany(), write via upsert(). */
export interface ContactRecord {
    /** Contact name */
    name?: string | null
    /** Role or title */
    title?: string | null
    /** Valtrix record ID of the customer or vendor the contact belongs to */
    party_id?: string | null
    /** Entity type of the linked party record: customer or vendor */
    party_type?: string | null
    /** Primary email address */
    email?: string | null
    /** Primary phone number */
    phone?: string | null
    /**
     * When the contact was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** An agreement with money attached, with either side of the business: prime contracts, subcontracts, purchase orders, work orders, memberships, subscriptions, and leases all collapse here, discriminated by kind. Their lines map to line_item and their changes to change_order or commitment_change_order. Query via valtrix.records.contract.findMany(), write via upsert(). */
export interface ContractRecord {
    /** Contract number */
    number?: string | null
    /** Contract title */
    title?: string | null
    /** One of: prime, subcontract, purchase_order, bid_request, service_contract, membership, subscription, lease, other. Map the source agreement types onto these; a priced request for proposal sent to a vendor before any order exists is bid_request, and a recurring service or maintenance agreement with a customer is service_contract */
    kind?: string | null
    /** Customer or vendor the agreement is with */
    counterparty?: string | null
    /** Valtrix record ID of the customer or vendor the agreement is with */
    counterparty_id?: string | null
    /** Entity type of the linked counterparty record: customer or vendor */
    counterparty_type?: string | null
    /** Valtrix record ID of the project the contract belongs to */
    project_id?: string | null
    /** Valtrix record ID of the employee who placed the order, for purchase orders whose source prints an Ordered By line */
    ordered_by_id?: string | null
    /** One of: draft, pending, sent, approved, rejected, fulfilled, completed, void. Map the source contract and purchase order states onto these (out for signature or awaiting approval is pending, issued to the counterparty is sent, executed is approved, received in full is fulfilled); the raw label stays in source data */
    status?: string | null
    /** Total contract value */
    total?: number | null
    /** Retainage percentage withheld */
    retainage_percent?: number | null
    /** Whether the contract is executed */
    executed?: boolean | null
    /**
     * Date of the agreement
     * ISO 8601 date string.
     */
    contract_at?: string | null
    /**
     * When the agreement takes effect (a membership start, a lease commencement, a subscription start)
     * ISO 8601 date string.
     */
    starts_at?: string | null
    /**
     * When the agreement ends or expires
     * ISO 8601 date string.
     */
    ends_at?: string | null
    /** One of: new, renewal, reactivation, upgrade, transfer, other. How the agreement came about, for recurring client agreements whose source labels a first sale, a renewal, or a win-back */
    origin?: string | null
    /** The plan, product line, or agreement category the source files it under; source-defined, pass it through */
    category?: string | null
    /** Name of the staff member who made the sale */
    sold_by?: string | null
    /** Name of the staff member credited with the commission when the source tracks one separately from the seller */
    commission_agent?: string | null
    /** Valtrix record ID of the piece of equipment the agreement is for, such as the machine a parts order or rental agreement was raised against */
    resource_id?: string | null
    /** Valtrix record ID of the maintenance work order or request a parts order was raised under */
    maintenance_order_id?: string | null
    /**
     * When the goods or work ordered are needed by
     * ISO 8601 date string.
     */
    needed_by?: string | null
}

/** A money-out document at the header level: vendor invoices, expenses, payroll, and other direct costs all collapse here, discriminated by kind. Its lines map to line_item; the transaction settling it maps to payment, and when one payment settles several costs each share is a payment_allocation. Payroll costs carry per-department allocation lines: line_item rows with document_type payroll and the department column filled. Query via valtrix.records.cost.findMany(), write via upsert(). */
export interface CostRecord {
    /** What the cost covers */
    description?: string | null
    /** One of: bill, credit, expense, payroll, card_transaction, other. A credit is a vendor credit or credit note that reduces what is owed (total stays positive); a vendor invoice is a bill */
    kind?: string | null
    /** One of: draft, pending, approved, rejected, paid, void. Map the source approval and payment states onto these (under review is pending, denied is rejected, cancelled is void, payment sent is paid); the raw label stays in source data */
    status?: string | null
    /** Vendor invoice reference */
    invoice_number?: string | null
    /** Vendor or employee paid */
    payee_name?: string | null
    /** Valtrix record ID of the vendor or employee paid */
    payee_id?: string | null
    /** Entity type of the linked payee record: vendor or employee */
    payee_type?: string | null
    /** Valtrix record ID of the project the cost belongs to */
    project_id?: string | null
    /** Valtrix record ID of the location the cost belongs to, for sources that book costs against a venue or site rather than a project */
    location_id?: string | null
    /** Total amount, in currency */
    total?: number | null
    /** ISO currency code the total is denominated in, null when the source books everything in one implicit currency */
    currency?: string | null
    /**
     * The bill or invoice date stated by the vendor on the document
     * ISO 8601 date string.
     */
    issued_at?: string | null
    /**
     * When payment is due
     * ISO 8601 date string.
     */
    due_at?: string | null
    /**
     * When the cost was received
     * ISO 8601 date string.
     */
    received_at?: string | null
    /**
     * When the cost was paid
     * ISO 8601 date string.
     */
    paid_at?: string | null
    /** Purchase order number the cost was raised against, as the source prints it, for sources that match bills to purchase orders */
    po_number?: string | null
    /** Valtrix record ID of the purchase order or contract the cost was raised against, for sources that sync their purchase orders as records; po_number keeps the number as the source prints it */
    contract_id?: string | null
    /** Amount before tax, in currency, for sources that print it separately from the total */
    subtotal?: number | null
    /** Tax charged on the document, in currency, for sources that print it separately from the total */
    tax?: number | null
    /** Tax the payer withholds from the payee and remits itself (the income tax and VAT retentions of a Mexican CFDI), in currency, for sources that print it; not part of tax */
    tax_withheld?: number | null
    /** Payment terms as the source states them (Net 30; on a Mexican CFDI the payment method, PUE for one payment or PPD for instalments or deferred payment); source-defined, pass it through */
    payment_terms?: string | null
    /** Cost center, business unit, or organization the cost is booked to, as the source names it; source-defined, pass it through */
    cost_center?: string | null
    /** The source's own review or audit state of the supporting document (audited, awaiting upload, rejected, cancelled), as it labels it; source-defined, pass it through. Distinct from status, which is the normalized lifecycle */
    review_status?: string | null
    /** The source's purchase-order match result for the bill (matched, invalid, unmatched), as it labels it; source-defined, pass it through */
    match_status?: string | null
    /** Valtrix record ID of the piece of equipment the cost was incurred on, for repair and service costs booked against a unit */
    resource_id?: string | null
    /** Valtrix record ID of the maintenance work order the cost was booked under */
    maintenance_order_id?: string | null
    /** Valtrix record ID of the card or bank instrument the cost was paid with at the moment it was incurred, for card transactions and other expenses settled on an instrument rather than through a later payment */
    financial_account_id?: string | null
    /** Valtrix record ID of the employee who incurred or submitted the cost: the cardholder of a card transaction, the submitter of an expense, for spend and expense sources that track who spent. Distinct from payee_id, which is who gets paid */
    employee_id?: string | null
    /** Valtrix record ID of the expense account the whole document is coded to, for sources that code a cost as one unit (a card charge coded to one account) rather than per line; a document with lines carries the account on each line_item instead */
    gl_account_id?: string | null
    /** Valtrix record ID of the cost code the whole document is coded to, for sources that code a cost as one unit; a document with lines carries the cost code on each line_item instead */
    cost_code_id?: string | null
    /** Cost type the whole document is coded to, as the source names it (material, labor, equipment, subcontract, other), for sources that code a cost as one unit; source-defined, pass it through */
    cost_type?: string | null
    /** Valtrix record ID of the general ledger journal entry that posting the cost produced, for accounting sources that sync both; null while the cost is unposted */
    journal_entry_id?: string | null
}

/** An entry in the org's cost code structure used to code budgets, costs, and time. Structural reference data, not a money document. Query via valtrix.records.cost_code.findMany(), write via upsert(). */
export interface CostCodeRecord {
    /** Full cost code */
    code?: string | null
    /** Cost code name */
    name?: string | null
    /** One of: active, inactive */
    status?: string | null
}

/** One actual cost posted to a project's job cost ledger: the line a bill, payroll run, equipment allocation, inventory issue, or journal entry books against a cost code and cost type, with the amount and hours. This is the ledger every job cost report is built from. The documents that produce postings stay where they are (cost, journal_entry) and are linked via document_type and document_id when synced; budget_detail is the per-cost-code rollup of these postings, and budget_line is what they are measured against. Query via valtrix.records.cost_transaction.findMany(), write via upsert(). */
export interface CostTransactionRecord {
    /** What the posting covers, as the source shows it */
    description?: string | null
    /** Source transaction or reference number the posting came from: the invoice, check, timecard, or journal number */
    number?: string | null
    /** One of: bill, card_transaction, payroll, equipment, inventory, journal, other. What produced the posting; map the source screen or transaction type onto these and keep the raw label in source data */
    source_kind?: string | null
    /** One of: posted, void. A voided posting stays in the ledger with status void and no longer counts toward job cost; filter status eq posted to total a job the way the source's own job cost reports do */
    status?: string | null
    /** Entity type of the synced document that produced the posting: cost or journal_entry */
    document_type?: string | null
    /** Valtrix record ID of the cost or journal entry that produced the posting, typed by document_type; null when the producing document is not synced */
    document_id?: string | null
    /** Project or job the cost was posted to */
    project_name?: string | null
    /** Valtrix record ID of the project the cost was posted to */
    project_id?: string | null
    /** Cost code the posting is coded against */
    cost_code?: string | null
    /** Valtrix record ID of the cost code the posting is coded against */
    cost_code_id?: string | null
    /** Cost type as the source names it (material, labor, equipment, subcontract, other); source-defined, pass it through */
    cost_type?: string | null
    /** Vendor the cost was incurred with, for postings that came from a bill, card charge, or inventory receipt */
    vendor_name?: string | null
    /** Valtrix record ID of the vendor the cost was incurred with */
    vendor_id?: string | null
    /** Employee whose labor the posting records, for postings that came from payroll or a timecard */
    employee_name?: string | null
    /** Valtrix record ID of the employee whose labor the posting records */
    employee_id?: string | null
    /** Valtrix record ID of the location the cost was posted to, for sources that book costs against a venue or site rather than a project */
    location_id?: string | null
    /** Valtrix record ID of the piece of equipment the posting is charged to or came from, for sources that cost equipment */
    resource_id?: string | null
    /** Cost amount posted, negative for a credit or reversal */
    amount?: number | null
    /** Labor or equipment hours the posting records, zero when the source posts none */
    hours?: number | null
    /** Units the posting records where the source counts them (pieces, equipment units); null otherwise */
    quantity?: number | null
    /** Whether the posting can be billed to the customer; false for non-billable postings and write-offs */
    billable?: boolean | null
    /** ISO currency code the amount is denominated in, null when the source books everything in one implicit currency */
    currency?: string | null
    /**
     * Accounting date of the posting as the source books it
     * ISO 8601 date string.
     */
    transaction_at?: string | null
    /**
     * When the posting was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** One insurance policy a customer holds with a payer: the member and group numbers, its rank among the customer's policies, and who holds it. The carrier itself maps to payer; a claim filed under the policy maps to invoice with its lines as line_item. Query via valtrix.records.coverage.findMany(), write via upsert(). */
export interface CoverageRecord {
    /** Valtrix record ID of the customer the policy covers */
    customer_id?: string | null
    /** Carrier or plan the policy is with */
    payer_name?: string | null
    /** Valtrix record ID of the carrier or plan the policy is with */
    payer_id?: string | null
    /** One of: primary, secondary, tertiary, other. The order the policy is billed in; map the source positions onto these */
    rank?: string | null
    /** Member, subscriber, or policy number */
    member_number?: string | null
    /** Group or plan number */
    group_number?: string | null
    /** Who holds the policy, as the source records it: a name, or Self when the customer is the holder */
    policy_holder?: string | null
    /**
     * Date of birth of the policy holder, for sources that keep one on the policy
     * ISO 8601 date string.
     */
    policy_holder_birthday?: string | null
    /** Copay due per visit under the policy, in currency */
    copay?: number | null
    /** Authorization or pre-approval code on file for the policy */
    authorization_code?: string | null
    /** One of: active, inactive. A terminated, replaced, or hidden policy is inactive */
    status?: string | null
    /**
     * When the policy takes effect
     * ISO 8601 date string.
     */
    starts_at?: string | null
    /**
     * When the policy ends
     * ISO 8601 date string.
     */
    ends_at?: string | null
    /**
     * When the policy was recorded in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A person or company the org sells to or performs work for, at the account level. Individual people at that account map to contact; parties the org buys from map to vendor. Query via valtrix.records.customer.findMany(), write via upsert(). */
export interface CustomerRecord {
    /** Full customer name */
    name?: string | null
    /** Primary email address */
    email?: string | null
    /** Primary phone number */
    phone?: string | null
    /** Country code or name */
    country?: string | null
    /** One of: prospect, active, inactive. Map the source lifecycle (archived, disabled, deleted, lead) onto these; the raw label stays in source data */
    status?: string | null
    /**
     * When the customer was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /**
     * Date of birth, for sources that keep one on the customer (a member, a patient, a client)
     * ISO 8601 date string.
     */
    birthday?: string | null
    /** One of: female, male, other. Map the source labels onto these; the raw label stays in source data */
    gender?: string | null
    /** Street address as one line */
    address?: string | null
    /** City, town, or district of the address */
    city?: string | null
    /** State, province, or region of the address, as the source names it */
    region?: string | null
    /** Marital or civil status as the source labels it; source-defined, pass it through */
    marital_status?: string | null
    /** Emergency contact as one line (name and phone), for sources that keep one on the customer */
    emergency_contact?: string | null
    /** Name of the staff member who owns the relationship: the assigned account executive, sales representative, or coach */
    owner?: string | null
    /** Whether the customer accepts marketing email, as the source records the consent */
    email_opt_in?: boolean | null
    /** Number of visits the source has counted for the customer, for sources that keep a running total on the guest or member (a point of sale guest book, a loyalty profile); the source's own count, not one derived from orders or bookings */
    visit_count?: number | null
    /**
     * When the source recorded the customer's first visit
     * ISO 8601 date string.
     */
    first_visit_at?: string | null
    /**
     * When the source recorded the customer's most recent visit
     * ISO 8601 date string.
     */
    last_visit_at?: string | null
    /** Lifetime amount the customer has spent across those visits as the source totals it, tax included and tips excluded, in the currency of the location */
    total_spend?: number | null
}

/** A file kept in a source's document library or project folder and managed as a record in its own right: drawings, specifications, supplier quotes, submittals, photos, and correspondence filed under a project or the org itself. The file rides along as a record attachment; this record carries its name, folder path, type, size, uploader, and dates. A file attached to another record (an invoice PDF, a receipt image, a signed waiver) stays an attachment on that record and does not map here. Query via valtrix.records.document.findMany(), write via upsert(). */
export interface DocumentRecord {
    /** File name as the source shows it, with its extension */
    name?: string | null
    /** Folder path the file sits under in the source, from the library root down to the file name */
    path?: string | null
    /** File type or category as the source labels it (PDF, Drawing, Schedule); source-defined, pass it through */
    file_type?: string | null
    /** Description or notes the source holds for the file */
    description?: string | null
    /** Size of the current version in bytes */
    bytes?: number | null
    /** Number of the current version, for sources that keep file versions */
    version?: number | null
    /** Name of the person who added the file */
    uploaded_by?: string | null
    /** Valtrix record ID of the project the file is filed under, null for a file kept at the company level */
    project_id?: string | null
    /** Valtrix record ID of the folder the file sits in, for sources that manage folders as records; null at the library root */
    folder_id?: string | null
    /**
     * When the file or its current version last changed in the source
     * ISO 8601 date string.
     */
    updated_at?: string | null
    /**
     * When the file was first added to the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A member of the org's own workforce, at the company level. A person's membership on a specific project maps to project_user, and their logged time maps to time_entry. Query via valtrix.records.employee.findMany(), write via upsert(). */
export interface EmployeeRecord {
    /** Full name */
    name?: string | null
    /** Work email address */
    email?: string | null
    /** Primary phone number */
    phone?: string | null
    /** Role within the company */
    job_title?: string | null
    /** Department, team, or division the employee belongs to, as the source names it; source-defined, pass it through */
    department?: string | null
    /** Annual base salary or salary-equivalent compensation, in the source currency */
    annual_salary?: number | null
    /** Internal employee number */
    employee_id?: string | null
    /**
     * When the employee started at the company, the hire date in the source system
     * ISO 8601 date string.
     */
    start_date?: string | null
    /** One of: active, inactive. Map terminated, archived, or disabled employees to inactive */
    status?: string | null
    /**
     * When the employee was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A customer's prepaid or granted balance of visits, credits, or time: class packs, punch cards, session credits, and membership allowances all map here. The purchase creating it maps to order, the agreement granting it maps to contract, and each redemption is a booking holding entitlement_id. Query via valtrix.records.entitlement.findMany(), write via upsert(). */
export interface EntitlementRecord {
    /** Catalog item the entitlement was granted from */
    item_name?: string | null
    /** Valtrix record ID of the item the entitlement was granted from */
    item_id?: string | null
    /** Valtrix record ID of the customer holding the entitlement */
    customer_id?: string | null
    /** Valtrix record ID of the membership or subscription agreement granting the entitlement */
    contract_id?: string | null
    /** Valtrix record ID of the order that purchased the entitlement */
    order_id?: string | null
    /** One of: visits, credits, minutes, currency. What the balance counts */
    kind?: string | null
    /** Quantity granted */
    quantity?: number | null
    /** Quantity remaining */
    remaining?: number | null
    /** One of: active, expired, exhausted, inactive. Map the source entitlement states onto these */
    status?: string | null
    /**
     * When the entitlement becomes usable
     * ISO 8601 date string.
     */
    starts_at?: string | null
    /**
     * When the entitlement expires
     * ISO 8601 date string.
     */
    expires_at?: string | null
    /**
     * When the entitlement was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A priced proposal issued before any agreement exists: quotes, bids, estimates, and proposals all map here. Its lines map to line_item; once accepted, the resulting agreement maps to contract (linked back via contract_id) and the resulting bill maps to invoice. Query via valtrix.records.estimate.findMany(), write via upsert(). */
export interface EstimateRecord {
    /** Estimate or quote number */
    number?: string | null
    /** One of: estimate, proposal, takeoff, other. A priced quote or estimate offered to the customer, including a treatment plan, is estimate; a formal bid or proposal document is proposal; the internal quantity and cost takeoff behind a bid is takeoff */
    kind?: string | null
    /** Estimate title */
    title?: string | null
    /** Customer the estimate was issued to */
    customer_name?: string | null
    /** Valtrix record ID of the customer the estimate was issued to */
    customer_id?: string | null
    /** Valtrix record ID of the project the estimate belongs to */
    project_id?: string | null
    /** Valtrix record ID of the contract the estimate became once accepted */
    contract_id?: string | null
    /** One of: draft, sent, pending, approved, rejected, expired, void. Map the source estimate and proposal states onto these; the raw label stays in source data */
    status?: string | null
    /** Total proposed amount */
    total?: number | null
    /** ISO currency code */
    currency?: string | null
    /**
     * When the estimate was issued
     * ISO 8601 date string.
     */
    issued_at?: string | null
    /**
     * When the estimate expires
     * ISO 8601 date string.
     */
    expires_at?: string | null
    /**
     * When the estimate was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A scheduled occurrence customers book into: group classes, courses, workshops, and open sessions, with capacity and start and end times. Each attendee's spot maps to booking; one-on-one reservations map straight to booking without an event; project schedule rows map to schedule_task. Query via valtrix.records.event.findMany(), write via upsert(). */
export interface EventRecord {
    /** Event name */
    name?: string | null
    /** One of: class, course, workshop, other. Map the source occurrence types onto these */
    kind?: string | null
    /** Valtrix record ID of the catalog item for the service the event delivers */
    item_id?: string | null
    /** Valtrix record ID of the employee leading the event, such as the instructor or teacher */
    employee_id?: string | null
    /** Valtrix record ID of the resource the event occupies, such as a room or court */
    resource_id?: string | null
    /** Valtrix record ID of the location the event takes place at */
    location_id?: string | null
    /** Maximum number of bookings */
    capacity?: number | null
    /** Number of spots taken */
    booked_count?: number | null
    /** One of: scheduled, cancelled, completed. Map the source event states onto these */
    status?: string | null
    /**
     * When the event starts
     * ISO 8601 date string.
     */
    start_at?: string | null
    /**
     * When the event ends
     * ISO 8601 date string.
     */
    end_at?: string | null
    /**
     * When the event was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A bank, card, or cash account the org moves money through, discriminated by kind: the payment instrument a payment is released from or received into, not the ledger account it posts to. gl_account_id, with gl_account_number and gl_account_name, carries the chart-of-accounts account the source maps the instrument to, so a payment can be traced from the account that released it to the ledger balance it reduces. Chart-of-accounts entries themselves map to gl_account. Query via valtrix.records.financial_account.findMany(), write via upsert(). */
export interface FinancialAccountRecord {
    /** Account name as the source labels it */
    name?: string | null
    /** One of: bank, card, cash, other. Instrument classification */
    kind?: string | null
    /** Finer-grained account type as the source names it (checking, savings, business); source-defined, pass it through */
    subtype?: string | null
    /** Last digits of the account number, never the full number */
    mask?: string | null
    /** One of: active, inactive */
    status?: string | null
    /** Valtrix record ID of the location the account is set up for, for sources that bank per venue or site */
    location_id?: string | null
    /** Number of the chart-of-accounts account the source maps the instrument to, as the source records the mapping */
    gl_account_number?: string | null
    /** Name of the chart-of-accounts account the source maps the instrument to */
    gl_account_name?: string | null
    /** Valtrix record ID of the mapped chart-of-accounts account, when that account is synced */
    gl_account_id?: string | null
}

/** A folder in a source's document library, kept as a record so a document write can name where a file lands: the folders of a construction project's Documents tree, a shared drive folder. The files inside it map to document via folder_id; the folder itself carries no file. Query via valtrix.records.folder.findMany(), write via upsert(). */
export interface FolderRecord {
    /** Folder name as the source shows it */
    name?: string | null
    /** Folder path below the library root, from the first folder down to this one, joined with slashes and without the root folder's own name (Internal Documents/Purchase Orders); null for the root folder itself */
    path?: string | null
    /** Valtrix record ID of the folder this one sits in, null for the root folder */
    parent_id?: string | null
    /** Valtrix record ID of the project the folder belongs to, null for a folder kept at the company level */
    project_id?: string | null
    /**
     * When the folder last changed in the source
     * ISO 8601 date string.
     */
    updated_at?: string | null
    /**
     * When the folder was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** An entry in the org's chart of accounts used to code money movements in accounting sources. Structural reference data, not a money document; project-coding structures map to cost_code instead. Query via valtrix.records.gl_account.findMany(), write via upsert(). */
export interface GlAccountRecord {
    /** Account number in the chart of accounts */
    number?: string | null
    /** Account name */
    name?: string | null
    /** One of: asset, liability, equity, income, expense. Account classification */
    kind?: string | null
    /** Finer-grained account type as the source names it (accounts receivable, fixed asset, cost of goods sold); source-defined, pass it through */
    subtype?: string | null
    /** ISO currency code */
    currency?: string | null
    /** One of: active, inactive */
    status?: string | null
}

/** A filed inspection of one piece of equipment against a checklist form, or one that was due and never filed: driver vehicle inspection reports, pre-use and daily walkarounds, and mechanic inspections all collapse here, discriminated by kind. The equipment maps to resource (linked via resource_id); a defect that becomes work maps to maintenance_order. A government building or permit inspection is not this: it stays on the project as schedule_task or activity. Query via valtrix.records.inspection.findMany(), write via upsert(). */
export interface InspectionRecord {
    /** Name of the inspection form or checklist that was filed */
    name?: string | null
    /** One of: dvir, inspection. A driver vehicle inspection report filed for regulatory compliance is dvir; every other checklist is inspection */
    kind?: string | null
    /** One of: completed, missed. A filed inspection is completed; one the source reports as due and not filed is missed */
    status?: string | null
    /** One of: pass, fail, other. The overall result of a filed inspection; a pass with noted defects is other. Null on a missed inspection */
    outcome?: string | null
    /** Name of the piece of equipment inspected */
    resource_name?: string | null
    /** Valtrix record ID of the piece of equipment inspected */
    resource_id?: string | null
    /** Valtrix record ID of the site or yard the equipment was at */
    location_id?: string | null
    /** Who filed the inspection, or who it was assigned to when missed */
    inspector_name?: string | null
    /** Valtrix record ID of the employee who filed the inspection or was assigned it */
    inspector_id?: string | null
    /** Engine or run hours recorded on the inspection */
    meter_hours?: number | null
    /** Odometer reading in miles recorded on the inspection; convert a source that reports kilometres */
    odometer_miles?: number | null
    /** Latitude where the inspection was filed */
    latitude?: number | null
    /** Longitude where the inspection was filed */
    longitude?: number | null
    /** The inspector's overall comments */
    comments?: string | null
    /**
     * When the inspection was due, for sources that schedule them
     * ISO 8601 date string.
     */
    due_at?: string | null
    /**
     * When the inspector started the checklist
     * ISO 8601 date string.
     */
    started_at?: string | null
    /**
     * When the inspection was filed
     * ISO 8601 date string.
     */
    completed_at?: string | null
    /**
     * When the record was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** The stock position of one item at one location: quantity on hand as of the source's latest count or running balance. A point-in-time read model; the movements that produce it map to inventory_movement. Query via valtrix.records.inventory_level.findMany(), write via upsert(). */
export interface InventoryLevelRecord {
    /** Item the level is for */
    item_name?: string | null
    /** Valtrix record ID of the item the level is for */
    item_id?: string | null
    /** Valtrix record ID of the location holding the stock */
    location_id?: string | null
    /** Quantity on hand */
    quantity?: number | null
    /** Unit of measure as the source names it; source-defined, pass it through */
    uom?: string | null
    /** Cost per unit used to value the stock */
    unit_cost?: number | null
    /**
     * When the level was measured or last updated
     * ISO 8601 date string.
     */
    as_of?: string | null
    /** Quantity at or below which the org reorders the item at this location */
    reorder_point?: number | null
    /** Lowest quantity the org wants on hand at this location */
    min_quantity?: number | null
    /** Highest quantity the org wants on hand at this location */
    max_quantity?: number | null
}

/** A single change to stock: receipts, transfers, adjustments, counts, waste, and sales depletion all map here, discriminated by kind. Transfers carry both locations; the resulting position maps to inventory_level. Query via valtrix.records.inventory_movement.findMany(), write via upsert(). */
export interface InventoryMovementRecord {
    /** One of: receipt, transfer, adjustment, count, waste, sale. Map the source movement types onto these */
    kind?: string | null
    /** Item the movement is for */
    item_name?: string | null
    /** Valtrix record ID of the item the movement is for */
    item_id?: string | null
    /** Valtrix record ID of the location the stock moved out of */
    from_location_id?: string | null
    /** Valtrix record ID of the location the stock moved into */
    to_location_id?: string | null
    /** Quantity moved, negative when stock decreases */
    quantity?: number | null
    /** Unit of measure as the source names it; source-defined, pass it through */
    uom?: string | null
    /** Cost per unit of the moved stock */
    unit_cost?: number | null
    /**
     * When the movement happened
     * ISO 8601 date string.
     */
    occurred_at?: string | null
    /**
     * When the movement was recorded in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A bill the org issues to a customer for money owed to the org. Receivables only: bills the org has to pay map to cost, and the transactions settling either side map to payment. Query via valtrix.records.invoice.findMany(), write via upsert(). */
export interface InvoiceRecord {
    /** Invoice number */
    number?: string | null
    /** One of: invoice, service, progress_billing, loan_draw, claim, credit, other. What the document is: a plain bill for goods or services is invoice; a field-service or work-order invoice is service; an application for payment under a contract (a progress or unitary billing, a payment application) is progress_billing; a draw against a construction loan is loan_draw; a claim filed with an insurer is claim; a credit memo that reduces what the customer owes is credit. A source that keeps both an application and the invoice it posted stamps each with its own kind and links them through origin_id */
    kind?: string | null
    /** Billed customer name */
    customer_name?: string | null
    /** Valtrix record ID of the billed customer */
    customer_id?: string | null
    /** Valtrix record ID of the project the invoice bills against */
    project_id?: string | null
    /** Valtrix record ID of the location the invoice belongs to, for sources that bill per venue or site rather than a project */
    location_id?: string | null
    /** Total amount due */
    amount?: number | null
    /** ISO currency code */
    currency?: string | null
    /** One of: draft, pending, approved, rejected, sent, partially_paid, paid, void. Map the source approval and payment states onto these; the raw label stays in source data */
    status?: string | null
    /**
     * Issue date
     * ISO 8601 date string.
     */
    issued_at?: string | null
    /**
     * Due date
     * ISO 8601 date string.
     */
    due_at?: string | null
    /**
     * When the work the invoice bills was scheduled, for field-service sources whose invoice or work order carries the appointment; other sources leave it empty
     * ISO 8601 date string.
     */
    scheduled_at?: string | null
    /** Valtrix record ID of the employee the invoice is credited to: the technician who performed the work on a service invoice, the salesperson on a sales invoice */
    employee_id?: string | null
    /** Invoice type or category as the source names it (a Sage 11-2 service type such as HVAC or Plumbing); source-defined, pass it through */
    category?: string | null
    /** Department, division, or subaccount the whole invoice is booked under, for accounting sources that class an invoice as one unit (the 1-7 subaccount every line of a Sage 11-2 service invoice posts under); source-defined, pass it through */
    department?: string | null
    /** Part of the open balance the customer owes personally, for sources that split a bill between the customer and an insurer */
    patient_balance?: number | null
    /** Part of the open balance billed to the customer's insurance, for sources that split a bill between the customer and an insurer */
    insurance_balance?: number | null
    /** The short title the source prints on the invoice (the job or service it bills), for sources that carry one beside the number */
    description?: string | null
    /** Free-text notes on the invoice as the source keeps them: the summary of work performed, the memo printed for the customer */
    notes?: string | null
    /** Valtrix record ID of the general ledger journal entry that posting the invoice produced, for accounting sources that sync both; null while the invoice is unposted */
    journal_entry_id?: string | null
    /** Valtrix record ID of the document this one was posted from, for sources that keep both an application and the receivable invoice posting it created (a Sage 100 Contractor 3-7 progress billing and its 3-2 invoice); a table that totals receivables keeps the rows whose origin is null */
    origin_id?: string | null
}

/** A catalog master record for a good or service the org sells, stocks, or buys: products, SKUs, menu items, materials, and rate-card services all map here. Usages of an item on a document map to line_item via item_id; stock on hand maps to inventory_level. Query via valtrix.records.item.findMany(), write via upsert(). */
export interface ItemRecord {
    /** Item name */
    name?: string | null
    /** SKU or item code in the source system */
    sku?: string | null
    /** Catalog category or family as the source names it; source-defined, pass it through */
    category?: string | null
    /** Default unit of measure as the source names it; source-defined, pass it through */
    uom?: string | null
    /** Standard selling price per unit */
    price?: number | null
    /** Standard acquisition or production cost per unit */
    cost?: number | null
    /** ISO currency code */
    currency?: string | null
    /** One of: active, inactive. Map archived, draft, or discontinued items to inactive */
    status?: string | null
    /**
     * When the item was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /** Who makes the item, for parts and materials catalogs */
    manufacturer?: string | null
    /** The manufacturer's own part number, when it differs from the sku the org files the item under */
    manufacturer_part_number?: string | null
    /** Valtrix record ID of the vendor the org prefers to buy the item from */
    vendor_id?: string | null
    /** The preferred vendor's own number for the item */
    vendor_sku?: string | null
}

/** A general ledger journal entry at the header level, the most general money record an accounting source exposes. Its debit and credit lines map to line_item coded by gl_account_id; documents with business meaning map to invoice, cost, or payment instead. Query via valtrix.records.journal_entry.findMany(), write via upsert(). */
export interface JournalEntryRecord {
    /** Journal entry number */
    number?: string | null
    /** What the entry records */
    description?: string | null
    /** One of: draft, posted, adjusted, void. Map the source posting states onto these */
    status?: string | null
    /** Valtrix record ID of the location the entry books for, for sources that journal per venue or site */
    location_id?: string | null
    /**
     * When the entry was posted to the ledger
     * ISO 8601 date string.
     */
    posted_at?: string | null
    /**
     * When the entry was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A single line on any financial document: contracts, purchase orders, invoices, orders, costs, estimates, and journal entries. The parent is identified by three columns: document_entity names the entity the parent record lives under (a bill line has document_entity cost), document_type carries the parent's kind (that same line has document_type bill), and document_id holds its record id. Every per-document line flavor lands here; budget rows are the one exception (budget_line). Query via valtrix.records.line_item.findMany(), write via upsert(). */
export interface LineItemRecord {
    /** What the line covers */
    description?: string | null
    /** Entity type of the document the line belongs to: contract, cost, invoice, order, estimate, or journal_entry. Read document_id from this entity; filter on it to select the lines of every cost, every contract, and so on */
    document_entity?: string | null
    /** One of: bill, credit, expense, payroll, card_transaction, invoice, order, estimate, bid_request, prime_contract, subcontract, purchase_order, work_order, requisition, change_order, journal_entry, claim, treatment_plan, other. The kind of the document the line belongs to, matching the parent record's kind rather than its entity (a line on a cost of kind bill has document_type bill and document_entity cost) */
    document_type?: string | null
    /** Valtrix record ID of the document the line belongs to, in the entity document_entity names */
    document_id?: string | null
    /** 1-based order of the line on its document as the source shows it; sort by this to render lines the way the source does */
    position?: number | null
    /** Valtrix record ID of the project the line belongs to */
    project_id?: string | null
    /** Valtrix record ID of the catalog item the line sells or consumes */
    item_id?: string | null
    /** Cost code the line is coded against */
    cost_code?: string | null
    /** Valtrix record ID of the cost code the line is coded against */
    cost_code_id?: string | null
    /** Valtrix record ID of the general ledger account the line is coded to, for accounting sources */
    gl_account_id?: string | null
    /** Ledger or charge account the line is coded to, as the source prints it, for sources that give the account as text rather than as a synced record; source-defined, pass it through */
    gl_account?: string | null
    /** Cost type as the source names it (labor, materials, subcontract); source-defined, pass it through */
    cost_type?: string | null
    /** Accounting class or tracking category the line is coded to (QuickBooks class, location or department class), as the source names it; source-defined, pass it through */
    class?: string | null
    /** Department, team, or division the line amount is allocated to, for payroll and labor costs, as the source names it; source-defined, pass it through */
    department?: string | null
    /** Quantity on the line */
    quantity?: number | null
    /** Unit of measure as the source names it; source-defined, pass it through */
    uom?: string | null
    /** Cost per unit */
    unit_cost?: number | null
    /** Line amount */
    amount?: number | null
    /** Extended line total */
    total?: number | null
    /**
     * When the line was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /** Discount applied to the line, in currency, as a positive number */
    discount?: number | null
    /** The coupon or discount code the discount came from; source-defined, pass it through */
    discount_code?: string | null
    /** Tax charged on the line, in currency */
    tax?: number | null
    /** Catalog category of what the line sells, as the source names it on the line (a menu group, a product family), written the way item.category is so the two can be compared; source-defined, pass it through */
    category?: string | null
    /** One of: active, void. A line the source voided or removed after it was entered stays on its document with status void and no longer counts toward the document total; sources with no such state leave it empty */
    status?: string | null
}

/** A standalone physical place record, such as a store, site, or warehouse. Only sources that model places as their own records produce these; address fields on another entity stay on that entity. Query via valtrix.records.location.findMany(), write via upsert(). */
export interface LocationRecord {
    /** Location name */
    name?: string | null
    /** One of: site, venue, warehouse, service_address, parcel, other. A job site, project location, or property is site; a store, branch, clinic, restaurant, or other place the org trades from is venue; an inventory or parts location is warehouse; a customer address work is performed at is service_address; a land parcel from a permit portal is parcel */
    kind?: string | null
    /** Street address */
    address?: string | null
    /**
     * When the location was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A unit of maintenance work on one piece of equipment: a maintenance or repair request, the work order that performs it, and a preventive service coming due all collapse here, discriminated by kind. The equipment maps to resource (linked via resource_id); labor booked to it maps to time_entry and outside service or parts costs to cost, both linked back via maintenance_order_id. A purchase order or subcontract with a vendor stays contract, and a project schedule row stays schedule_task. Query via valtrix.records.maintenance_order.findMany(), write via upsert(). */
export interface MaintenanceOrderRecord {
    /** What the work is, as the source titles it: the complaint, the work order title, or the service coming due */
    title?: string | null
    /** Work order or request number as the source prints it */
    number?: string | null
    /** One of: request, work_order, preventive. A reported problem or request for work is request; the job that carries out the work is work_order; a scheduled service coming due on a usage or time trigger, before any work order exists, is preventive */
    kind?: string | null
    /** One of: open, scheduled, in_progress, on_hold, completed, cancelled. Map the source states onto these: new, pending, requested, or due is open; approved, planned, or assigned with dates is scheduled; started is in_progress; waiting on parts or paused is on_hold; resolved, closed, or done is completed; denied, rejected, or voided is cancelled. The raw label stays in source data */
    status?: string | null
    /** One of: low, medium, high, urgent. Critical or emergency is urgent */
    priority?: string | null
    /** The org's own classification of the work (Repair, Preventative Maintenance, Damage, Warranty); source-defined, pass it through */
    maintenance_type?: string | null
    /** The problem reported or the work to perform, as plain text */
    description?: string | null
    /** Name of the piece of equipment the work is on */
    resource_name?: string | null
    /** Valtrix record ID of the piece of equipment the work is on */
    resource_id?: string | null
    /** Valtrix record ID of the site, yard, or shop the work was requested from or is performed at */
    location_id?: string | null
    /** Valtrix record ID of the work order a request or preventive service was rolled into; null on a work order itself */
    work_order_id?: string | null
    /** Who asked for the work */
    requested_by_name?: string | null
    /** Valtrix record ID of the employee who asked for the work */
    requested_by_id?: string | null
    /** The mechanic or technician the work is assigned to; several names joined with a comma when the source assigns more than one */
    assigned_to_name?: string | null
    /** Valtrix record ID of the first mechanic or technician assigned */
    assigned_to_id?: string | null
    /** Whether the equipment is down until the work is done */
    out_of_service?: boolean | null
    /** Engine or run hours on the equipment when the work was raised */
    meter_hours?: number | null
    /** Odometer reading in miles when the work was raised; convert a source that reports kilometres */
    odometer_miles?: number | null
    /**
     * When the work is needed by, or when a time-triggered preventive service comes due
     * ISO 8601 date string.
     */
    due_at?: string | null
    /** The meter reading a usage-triggered preventive service comes due at, in meter_unit */
    due_meter?: number | null
    /** Unit due_meter counts in, as the source names it (Hours, Miles, Kilometers); source-defined, pass it through */
    meter_unit?: string | null
    /**
     * When the work is planned to start
     * ISO 8601 date string.
     */
    scheduled_start_at?: string | null
    /**
     * When the work is planned to finish
     * ISO 8601 date string.
     */
    scheduled_end_at?: string | null
    /**
     * When the work was completed or the request resolved
     * ISO 8601 date string.
     */
    completed_at?: string | null
    /** Labor cost booked to the work, in currency */
    labor_cost?: number | null
    /** Parts cost booked to the work, in currency */
    parts_cost?: number | null
    /** Total cost of the work including labor, parts, outside services, and markups, in currency */
    total_cost?: number | null
    /**
     * When the record was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A potential sale the org is pursuing through the stages of a sales pipeline: deals, opportunities, and qualified pipeline leads all map here. The account being pursued maps to customer (linked via customer_id); a priced proposal issued along the way maps to estimate, and the agreement once won maps to contract. Query via valtrix.records.opportunity.findMany(), write via upsert(). */
export interface OpportunityRecord {
    /** Opportunity or deal name, commonly the prospect account name */
    name?: string | null
    /** Sales pipeline the opportunity is tracked in, as the source names it */
    pipeline?: string | null
    /** Pipeline stage as the source names it; this is a source-defined label, not a vocabulary, so pass it through */
    stage?: string | null
    /** One of: open, won, lost. Map closed-won and closed-lost stages onto won and lost; everything still in play is open */
    status?: string | null
    /** Prospect account name */
    customer_name?: string | null
    /** Valtrix record ID of the prospect account */
    customer_id?: string | null
    /** Primary contact name on the deal */
    contact_name?: string | null
    /** Valtrix record ID of the primary contact on the deal */
    contact_id?: string | null
    /** Primary contact email address */
    email?: string | null
    /** Prospect website URL */
    website?: string | null
    /** Expected deal value */
    amount?: number | null
    /** ISO currency code */
    currency?: string | null
    /** Free-form notes on the opportunity */
    notes?: string | null
    /**
     * When the opportunity was won or lost
     * ISO 8601 date string.
     */
    closed_at?: string | null
    /**
     * When the opportunity was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A customer order for goods or services with a total and fulfilment status, such as a sales, e-commerce, or point-of-sale order. A signed agreement of any kind maps to contract, and the resulting bill maps to invoice. Query via valtrix.records.order.findMany(), write via upsert(). */
export interface OrderRecord {
    /** Order number */
    number?: string | null
    /** Ordering customer name */
    customer_name?: string | null
    /** Valtrix record ID of the ordering customer */
    customer_id?: string | null
    /** Valtrix record ID of the project the order belongs to or kicked off */
    project_id?: string | null
    /** Valtrix record ID of the location the order was placed at, for sources that scope orders to a store or venue */
    location_id?: string | null
    /** Order total */
    total?: number | null
    /** ISO currency code */
    currency?: string | null
    /** One of: draft, pending, approved, rejected, unfulfilled, partially_fulfilled, fulfilled, cancelled. Map the source approval and fulfilment states onto these; the raw label stays in source data */
    status?: string | null
    /** Number of line items */
    items_count?: number | null
    /**
     * When the order was placed
     * ISO 8601 date string.
     */
    placed_at?: string | null
    /** Order amount before tax and tips, after discounts, for sources that break the total down */
    subtotal?: number | null
    /** Tax charged on the order */
    tax?: number | null
    /** Tips and gratuity the customer added to the order, for point-of-sale and delivery sources */
    tip?: number | null
    /** Discounts applied to the order, in currency, as a positive number */
    discount?: number | null
    /** Where the order was placed, as the source names it (in store, online, a third-party marketplace); source-defined, pass it through */
    channel?: string | null
    /** Staff member who took or owns the order (a server, cashier, or sales representative), for sources that record one */
    employee_name?: string | null
    /** Valtrix record ID of the staff member who took or owns the order */
    employee_id?: string | null
}

/** An insurance carrier or plan the org bills on behalf of its customers: vision, medical, and dental insurers and the plans they offer all map here, discriminated by kind. A customer's own policy with the payer maps to coverage; the money the payer sends maps to payment. Query via valtrix.records.payer.findMany(), write via upsert(). */
export interface PayerRecord {
    /** Carrier or plan name as the org lists it */
    name?: string | null
    /** One of: medical, vision, dental, other. The line of insurance the payer covers; map the source's insurance types onto these */
    kind?: string | null
    /** Electronic payer id the org files claims under (the clearinghouse payer id), as the source prints it */
    payer_code?: string | null
    /** One of: active, inactive. Map hidden, archived, or disabled payers to inactive */
    status?: string | null
    /**
     * When the payer was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A payment transaction, issued to a vendor or received from a client, discriminated by kind, typically settling an invoice or cost. invoice_id and cost_id name the primary document; when one payment settles several documents, every share lives in payment_allocation and those rows are authoritative. The document being settled is not a payment. Query via valtrix.records.payment.findMany(), write via upsert(). */
export interface PaymentRecord {
    /** Payment number */
    number?: string | null
    /** One of: issued, received, settlement. Issued to a vendor or received from a client; settlement is a payment processor depositing the card payments it collected into the org's bank account, which is not new income, so a total of money received leaves it out */
    kind?: string | null
    /** Customer or vendor the payment settles with */
    counterparty?: string | null
    /** Valtrix record ID of the customer or vendor the payment settles with */
    counterparty_id?: string | null
    /** Entity type of the linked counterparty record: customer or vendor */
    counterparty_type?: string | null
    /** Invoice the payment settles */
    invoice_number?: string | null
    /** Valtrix record ID of the invoice the payment settles */
    invoice_id?: string | null
    /** Check or reference number */
    check_number?: string | null
    /** Valtrix record ID of the primary cost the payment settles; a payment covering several costs lists each share in payment_allocation */
    cost_id?: string | null
    /** Valtrix record ID of the project the payment belongs to */
    project_id?: string | null
    /** Valtrix record ID of the location the payment belongs to, for sources that settle money per venue or site rather than a project */
    location_id?: string | null
    /** Valtrix record ID of the bank, card, or cash account the payment was released from or received into, for sources that record the settling instrument */
    financial_account_id?: string | null
    /** Amount paid */
    amount?: number | null
    /** One of: pending, sent, paid, failed, void. Map the source payment states onto these (authorized or in a check run is pending, cancelled is void); the raw label stays in source data */
    status?: string | null
    /**
     * Date of the payment
     * ISO 8601 date string.
     */
    paid_at?: string | null
    /**
     * When the payment was recorded in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /** One of: cash, credit_card, debit_card, card, transfer, check, other. How the payment was made; use card when the source does not say credit or debit */
    method?: string | null
    /** Number of card installments the payment was split into, for sources that record one */
    installments?: number | null
    /** ISO currency code the amount is denominated in, for sources that pay in more than one currency */
    currency?: string | null
    /** Valtrix record ID of the general ledger journal entry that posting the payment produced, for accounting sources that sync both */
    journal_entry_id?: string | null
    /** Valtrix record ID of the order the payment settles, for point-of-sale and e-commerce sources where a customer pays an order rather than an invoice */
    order_id?: string | null
    /** Tips and gratuity included in the amount, for point-of-sale sources that record them on the payment */
    tip?: number | null
    /** Processing fee the payment processor charged on the payment, as a positive number */
    fee?: number | null
    /** Amount of the payment returned to the payer, as a positive number; null when nothing was refunded */
    refunded_amount?: number | null
    /**
     * When the payment was refunded
     * ISO 8601 date string.
     */
    refunded_at?: string | null
    /** Card network as the source names it (Visa, Mastercard, Amex); source-defined, pass it through */
    card_brand?: string | null
    /** Last four digits of the card, never the full number */
    card_last4?: string | null
}

/** One share of a payment applied to one document: the row that links a payment to each cost or invoice it settles, with the amount applied. A payment settling a single document still gets one allocation; a check covering several bills gets one per bill, and vendor credits applied against the payment carry negative amounts. The allocations of a payment sum to its amount. Query via valtrix.records.payment_allocation.findMany(), write via upsert(). */
export interface PaymentAllocationRecord {
    /** Valtrix record ID of the payment this share belongs to */
    payment_id?: string | null
    /** Entity type of the settled document: cost or invoice */
    document_type?: string | null
    /** Valtrix record ID of the cost or invoice this share settles, typed by document_type */
    document_id?: string | null
    /** Source document number of the settled cost or invoice */
    invoice_number?: string | null
    /** Amount of the payment applied to the document; negative for a credit applied against the payment */
    amount?: number | null
    /** 1-based order of the share within its payment as the source shows it */
    position?: number | null
}

/** A prescription written for a customer: spectacle and contact lens prescriptions with their per-eye values, and medication orders, discriminated by kind. The exam or visit it came from maps to activity or booking; the sale that fills it maps to invoice or order. Query via valtrix.records.prescription.findMany(), write via upsert(). */
export interface PrescriptionRecord {
    /** One line naming the prescription as the source lists it (its type and date, or the drug and strength) */
    summary?: string | null
    /** One of: glasses, contacts, medication, other. Map the source prescription types onto these */
    kind?: string | null
    /** Valtrix record ID of the customer the prescription is for */
    customer_id?: string | null
    /** Valtrix record ID of the location the prescription was written or entered at */
    location_id?: string | null
    /** Name of the doctor who wrote the prescription, as the source prints it */
    prescriber?: string | null
    /**
     * Date of the prescription
     * ISO 8601 date string.
     */
    issued_at?: string | null
    /**
     * When the prescription expires
     * ISO 8601 date string.
     */
    expires_at?: string | null
    /** Free-text notes on the prescription */
    notes?: string | null
    /**
     * When the prescription was recorded in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /** Sphere power of the right eye, in diopters */
    right_sphere?: number | null
    /** Cylinder power of the right eye, in diopters */
    right_cylinder?: number | null
    /** Cylinder axis of the right eye, in degrees */
    right_axis?: number | null
    /** Near addition of the right eye, in diopters */
    right_add?: number | null
    /** Sphere power of the left eye, in diopters */
    left_sphere?: number | null
    /** Cylinder power of the left eye, in diopters */
    left_cylinder?: number | null
    /** Cylinder axis of the left eye, in degrees */
    left_axis?: number | null
    /** Near addition of the left eye, in diopters */
    left_add?: number | null
    /** Binocular distance pupillary distance, in millimetres */
    pupillary_distance?: number | null
    /** Contact lens prescribed for the right eye, as the source names the product */
    right_lens?: string | null
    /** Base curve of the right contact lens, in millimetres */
    right_base_curve?: number | null
    /** Diameter of the right contact lens, in millimetres */
    right_diameter?: number | null
    /** Power of the right contact lens, in diopters */
    right_lens_power?: number | null
    /** Contact lens prescribed for the left eye, as the source names the product */
    left_lens?: string | null
    /** Base curve of the left contact lens, in millimetres */
    left_base_curve?: number | null
    /** Diameter of the left contact lens, in millimetres */
    left_diameter?: number | null
    /** Power of the left contact lens, in diopters */
    left_lens_power?: number | null
}

/** A job, project, or engagement that work is performed under, with stage, value, and dates. The scoping parent most project-scoped records hang off; every job or engagement flavor from any source maps here. Query via valtrix.records.project.findMany(), write via upsert(). */
export interface ProjectRecord {
    /** Project name */
    name?: string | null
    /** Job or project number */
    number?: string | null
    /** Free-text description or summary of the work as the source keeps it: a technician's summary of work on a field-service job, a project brief. Filled by sources that carry one; others leave it empty */
    description?: string | null
    /** Customer the project is for */
    customer_name?: string | null
    /** Valtrix record ID of the customer the project is for */
    customer_id?: string | null
    /** The person the job is assigned to as the source names them: the field technician on a service job; several names joined with a comma when the source assigns more than one. Filled by sources that assign work to people; others leave it empty */
    assigned_to_name?: string | null
    /** Lifecycle stage as the source names it (estimating, pre-construction, warranty); source-defined, pass it through */
    stage?: string | null
    /** One of: draft, applied, in_review, corrections, approved, issued, inspections, on_hold, finaled, denied, withdrawn, void, expired, other. Where a permit, plan review, or application sits in its lifecycle, mapped from the portal state so counts combine across portals: unsubmitted or saved is draft; submitted, received, or pending intake is applied; under review, in process, or routing is in_review; resubmit, corrections, or waiting on the applicant is corrections; approved or ready to issue is approved; issued or permitted is issued; a temporary certificate or inspections pending is inspections; hold or stop work is on_hold; finaled, closed, completed, or certificate of occupancy is finaled; denied or rejected is denied; withdrawn is withdrawn; void or cancelled is void; expired or archived is expired; a state that fits none is other. Only permitting and plan-review sources fill it; construction and job sources leave it null and keep their own stage */
    lifecycle_stage?: string | null
    /** Site city */
    city?: string | null
    /** Site country code or name */
    country?: string | null
    /** Permitting authority the project is filed with: the city, county, or agency whose portal it lives in. Set per portal by the connector, not read off the record; sources that are not permit portals leave it empty */
    jurisdiction?: string | null
    /** Contracted project value */
    value?: number | null
    /** One of: active, closed, inactive. Completed or closed projects are closed; archived or disabled ones are inactive */
    status?: string | null
    /**
     * Planned start date
     * ISO 8601 date string.
     */
    start_at?: string | null
    /**
     * Planned completion date
     * ISO 8601 date string.
     */
    completion_at?: string | null
    /**
     * When the project was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A person's membership in a specific project's directory. The person's company-level record maps to employee (internal) or contact (external). Query via valtrix.records.project_user.findMany(), write via upsert(). */
export interface ProjectUserRecord {
    /** Full name */
    name?: string | null
    /** Work email address */
    email?: string | null
    /** Primary phone number */
    phone?: string | null
    /** Role within the project */
    job_title?: string | null
    /** Valtrix record ID of the company-level record for this person, an employee for internal staff or a contact for external members */
    person_id?: string | null
    /** Entity type of the linked person record: employee or contact */
    person_type?: string | null
    /** Valtrix record ID of the project the person is a member of */
    project_id?: string | null
    /** One of: active, inactive */
    status?: string | null
}

/** A vendor's assignment to a specific project's directory. The vendor's company-level record maps to vendor. Query via valtrix.records.project_vendor.findMany(), write via upsert(). */
export interface ProjectVendorRecord {
    /** Vendor company name */
    name?: string | null
    /** Trade or specialty the vendor operates in, as the source names it; source-defined, pass it through */
    trade?: string | null
    /** City of the primary address */
    city?: string | null
    /** Country code or name */
    country?: string | null
    /** Valtrix record ID of the company-level vendor record */
    vendor_id?: string | null
    /** Valtrix record ID of the project the vendor is assigned to */
    project_id?: string | null
    /** One of: active, inactive */
    status?: string | null
}

/** A bookable or tracked asset at a location: courts, rooms, desks, chairs, operatories, lanes, and equipment all map here, discriminated by kind. A fleet unit from an equipment management source (a machine, vehicle, trailer, or attachment) is kind equipment and fills the make, model, serial, meter, and position columns. Reservations of it map to booking, work performed on it maps to maintenance_order, inspections of it map to inspection, and the venue itself maps to location. Query via valtrix.records.resource.findMany(), write via upsert(). */
export interface ResourceRecord {
    /** Resource name */
    name?: string | null
    /** One of: court, room, desk, chair, operatory, lane, equipment, other. Map the source resource types onto these */
    kind?: string | null
    /** Valtrix record ID of the location the resource belongs to */
    location_id?: string | null
    /** How many people the resource accommodates at once */
    capacity?: number | null
    /** One of: active, inactive */
    status?: string | null
    /**
     * When the resource was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /** Manufacturer of the equipment or vehicle (Caterpillar, Ford). Filled by equipment and fleet sources */
    make?: string | null
    /** Manufacturer model designation (320 GC, F-550) */
    model?: string | null
    /** Model year */
    year?: number | null
    /** Manufacturer serial number or product identification number */
    serial_number?: string | null
    /** Vehicle identification number, for on-road vehicles */
    vin?: string | null
    /** The number the org itself knows the unit by: fleet, unit, or equipment number */
    fleet_number?: string | null
    /** Registration plate, for on-road vehicles */
    license_plate?: string | null
    /** Equipment category or class as the source names it (Excavator, Light Truck, Trenchbox); source-defined, pass it through */
    category?: string | null
    /** One of: owned, rented, leased, other. How the org holds the unit; a rent-to-own unit still on rent is rented */
    ownership?: string | null
    /** What the unit is doing right now as the source names it (available, in use, down, in transit); source-defined, pass it through. Whether the record is still in service is status */
    operational_status?: string | null
    /** Latest engine or run hours the source holds for the unit */
    meter_hours?: number | null
    /** Latest odometer reading in miles; convert a source that reports kilometres */
    odometer_miles?: number | null
    /** What the org paid for the unit */
    purchase_price?: number | null
    /**
     * When the org acquired the unit
     * ISO 8601 date string.
     */
    purchase_date?: string | null
    /** Latitude of the last known position, for tracked units */
    latitude?: number | null
    /** Longitude of the last known position, for tracked units */
    longitude?: number | null
    /**
     * When the last known position was reported
     * ISO 8601 date string.
     */
    located_at?: string | null
    /** Valtrix record ID of the employee the unit is currently assigned to (its operator or driver) */
    assigned_to_id?: string | null
    /** Manufacturer of the engine, which often differs from the maker of the machine */
    engine_make?: string | null
    /** Engine model designation */
    engine_model?: string | null
    /** Serial number of the engine, the key parts suppliers look engine parts up by */
    engine_serial_number?: string | null
}

/** A task or milestone on a project schedule, with WBS position, dates, and percent complete. Any Gantt or schedule row flavor maps here. Each plan-review discipline on a government permit or plan-review portal also maps here, as one non-milestone task per discipline keyed to the project (name is the discipline, description is the review outcome), so reviews read as one uniform set of rows across every portal. Query via valtrix.records.schedule_task.findMany(), write via upsert(). */
export interface ScheduleTaskRecord {
    /** Task name; for a plan-review discipline, the discipline (Electrical, Mechanical, Structural) */
    name?: string | null
    /** One of: task, appointment, inspection, plan_review, revision, workflow, other. A schedule or Gantt task is task; a booked visit on a field-service job is appointment; a permit or site inspection is inspection; a plan review step or discipline review is plan_review; a resubmittal cycle of a plan is revision; the whole review workflow a portal runs on a project is workflow */
    kind?: string | null
    /** What the task covers. For a plan-review discipline, carry the review outcome from the shared review vocabulary so counts combine across permit portals: Approved, Not Approved, In Progress, Not Started. Map the portal state onto these (corrections required and resubmit are Not Approved, under review and prescreen are In Progress); the raw portal label stays in source data */
    description?: string | null
    /** Work breakdown structure position */
    wbs?: string | null
    /** Assigned resource or crew */
    resource_name?: string | null
    /** Valtrix record ID of the project the task is scheduled on */
    project_id?: string | null
    /** Percentage complete */
    percent_complete?: number | null
    /** Whether the task is on the critical path */
    critical?: boolean | null
    /** Whether the task is a milestone */
    milestone?: boolean | null
    /**
     * Planned start date
     * ISO 8601 date string.
     */
    start_at?: string | null
    /**
     * Planned finish date
     * ISO 8601 date string.
     */
    finish_at?: string | null
    /**
     * When the task was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A reusable document or message template the org authors in a source and fills per customer: contract and agreement templates, email and message templates, and forms, discriminated by kind, with the template body as stored. This is the authored template itself, not a filled copy; a signed instrument produced from one maps to compliance_document, and a file attached to a record rides along as a record attachment. Query via valtrix.records.template.findMany(), write via upsert(). */
export interface TemplateRecord {
    /** Template name as the source labels it */
    name?: string | null
    /** One of: contract, email, message, form, other. Map the source template types onto these */
    kind?: string | null
    /** The source's identifier for the template, when it has one apart from the name */
    code?: string | null
    /** Subject line, for email and message templates */
    subject?: string | null
    /** Template body as stored in the source, with its placeholders intact (HTML or text) */
    body?: string | null
    /** One of: active, inactive. Map archived or disabled templates to inactive */
    status?: string | null
    /**
     * When the template was last edited in the source
     * ISO 8601 date string.
     */
    updated_at?: string | null
    /**
     * When the template was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
}

/** A single logged block of labor time: who worked, on what project and cost code, for how many hours or at what cost. Any timesheet or timecard flavor maps here. Query via valtrix.records.time_entry.findMany(), write via upsert(). */
export interface TimeEntryRecord {
    /** Who logged the time */
    employee_name?: string | null
    /** One of: labor, equipment, other. Hours a person worked (a timecard, timesheet, shift, or clock-in) are labor; hours a machine ran are equipment */
    kind?: string | null
    /** Valtrix record ID of the employee who logged the time */
    employee_id?: string | null
    /** Project or job the time was logged against */
    project_name?: string | null
    /** Valtrix record ID of the project the time was logged against */
    project_id?: string | null
    /** Cost code the time was logged against */
    cost_code?: string | null
    /** Valtrix record ID of the cost code the time was logged against */
    cost_code_id?: string | null
    /** Valtrix record ID of the location the time was worked at, for sources that schedule labor per venue or site rather than a project */
    location_id?: string | null
    /** Hours worked */
    hours?: number | null
    /** Labor cost of the entry */
    cost?: number | null
    /**
     * When the entry started
     * ISO 8601 date string.
     */
    started_at?: string | null
    /**
     * When the entry ended
     * ISO 8601 date string.
     */
    ended_at?: string | null
    /**
     * When the entry was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /** Valtrix record ID of the piece of equipment the time was spent on, for mechanic and shop time logged against a unit */
    resource_id?: string | null
    /** Valtrix record ID of the maintenance work order the time was logged against */
    maintenance_order_id?: string | null
    /** Tips and gratuity the employee earned on the entry, for restaurant and retail timecards */
    tips?: number | null
    /** Hourly wage the entry was paid at */
    hourly_rate?: number | null
    /** Hours of the entry paid as overtime */
    overtime_hours?: number | null
    /** Break time taken during the entry, paid and unpaid together, in hours */
    break_hours?: number | null
}

/** A company the org buys from or subcontracts to, at the company-directory level. A vendor's assignment to a specific project maps to project_vendor; the agreement itself maps to contract. Query via valtrix.records.vendor.findMany(), write via upsert(). */
export interface VendorRecord {
    /** Vendor company name */
    name?: string | null
    /** Trade or specialty the vendor operates in, as the source names it; source-defined, pass it through */
    trade?: string | null
    /** Primary contact email */
    email?: string | null
    /** Primary phone number */
    phone?: string | null
    /** City of the primary address */
    city?: string | null
    /** Country code or name */
    country?: string | null
    /** One of: active, inactive. Map archived, disabled, or deleted vendors to inactive */
    status?: string | null
    /**
     * When the vendor was created in the source
     * ISO 8601 date string.
     */
    created_at?: string | null
    /** Tax identification number of the vendor (RFC, EIN, VAT number), as the source prints it, for sources that key suppliers by it */
    tax_id?: string | null
}

export const valtrix = createClient<{
    tables: {
    }
    records: {
        activity: ActivityRecord
        booking: BookingRecord
        budget_change: BudgetChangeRecord
        budget_detail: BudgetDetailRecord
        budget_line: BudgetLineRecord
        change_event: ChangeEventRecord
        change_order: ChangeOrderRecord
        commitment_change_order: CommitmentChangeOrderRecord
        compliance_document: ComplianceDocumentRecord
        contact: ContactRecord
        contract: ContractRecord
        cost: CostRecord
        cost_code: CostCodeRecord
        cost_transaction: CostTransactionRecord
        coverage: CoverageRecord
        customer: CustomerRecord
        document: DocumentRecord
        employee: EmployeeRecord
        entitlement: EntitlementRecord
        estimate: EstimateRecord
        event: EventRecord
        financial_account: FinancialAccountRecord
        folder: FolderRecord
        gl_account: GlAccountRecord
        inspection: InspectionRecord
        inventory_level: InventoryLevelRecord
        inventory_movement: InventoryMovementRecord
        invoice: InvoiceRecord
        item: ItemRecord
        journal_entry: JournalEntryRecord
        line_item: LineItemRecord
        location: LocationRecord
        maintenance_order: MaintenanceOrderRecord
        opportunity: OpportunityRecord
        order: OrderRecord
        payer: PayerRecord
        payment: PaymentRecord
        payment_allocation: PaymentAllocationRecord
        prescription: PrescriptionRecord
        project: ProjectRecord
        project_user: ProjectUserRecord
        project_vendor: ProjectVendorRecord
        resource: ResourceRecord
        schedule_task: ScheduleTaskRecord
        template: TemplateRecord
        time_entry: TimeEntryRecord
        vendor: VendorRecord
    }
}>({
    tables: {
    },
    records: ['activity', 'booking', 'budget_change', 'budget_detail', 'budget_line', 'change_event', 'change_order', 'commitment_change_order', 'compliance_document', 'contact', 'contract', 'cost', 'cost_code', 'cost_transaction', 'coverage', 'customer', 'document', 'employee', 'entitlement', 'estimate', 'event', 'financial_account', 'folder', 'gl_account', 'inspection', 'inventory_level', 'inventory_movement', 'invoice', 'item', 'journal_entry', 'line_item', 'location', 'maintenance_order', 'opportunity', 'order', 'payer', 'payment', 'payment_allocation', 'prescription', 'project', 'project_user', 'project_vendor', 'resource', 'schedule_task', 'template', 'time_entry', 'vendor'],
    schemaVersions: {
    },
})
