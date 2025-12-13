import React, { useState } from "react";
import api from "../lib/api";

export default function BillingSection({ jobCard, onUpdate, userRole }) {
    const [spareParts, setSpareParts] = useState(jobCard.spareParts || []);
    const [serviceCosts, setServiceCosts] = useState(jobCard.serviceCosts || []);
    const [discount, setDiscount] = useState(jobCard.billing?.discount || 0);
    const [discountType, setDiscountType] = useState(jobCard.billing?.discountType || "fixed");
    const [saving, setSaving] = useState(false);

    // Check if user can edit billing
    const canEditBilling = ["admin", "manager", "cashier", "service_advisor"].includes(userRole);
    const canUpdatePayment = ["admin", "manager", "cashier"].includes(userRole);

    // Add new spare part
    const addSparePart = () => {
        setSpareParts([...spareParts, { name: "", partNumber: "", quantity: 1, unitPrice: 0, total: 0 }]);
    };

    // Update spare part
    const updateSparePart = (index, field, value) => {
        const updated = [...spareParts];
        updated[index][field] = value;

        // Auto-calculate total
        if (field === "quantity" || field === "unitPrice") {
            updated[index].total = updated[index].quantity * updated[index].unitPrice;
        }

        setSpareParts(updated);
    };

    // Remove spare part
    const removeSparePart = (index) => {
        setSpareParts(spareParts.filter((_, i) => i !== index));
    };

    // Add service cost
    const addServiceCost = () => {
        setServiceCosts([...serviceCosts, { description: "", cost: 0 }]);
    };

    // Update service cost
    const updateServiceCost = (index, field, value) => {
        const updated = [...serviceCosts];
        updated[index][field] = value;
        setServiceCosts(updated);
    };

    // Remove service cost
    const removeServiceCost = (index) => {
        setServiceCosts(serviceCosts.filter((_, i) => i !== index));
    };

    // Calculate totals
    const calculateTotals = () => {
        const sparePartsTotal = spareParts.reduce((sum, part) => sum + (part.total || 0), 0);
        const serviceCostsTotal = serviceCosts.reduce((sum, service) => sum + (service.cost || 0), 0);
        const subtotal = sparePartsTotal + serviceCostsTotal;

        let discountAmount = 0;
        if (discount > 0) {
            discountAmount = discountType === "percentage" ? (subtotal * discount) / 100 : discount;
        }

        const afterDiscount = subtotal - discountAmount;
        const taxAmount = (afterDiscount * 18) / 100; // 18% GST
        const grandTotal = afterDiscount + taxAmount;

        return {
            subtotal: subtotal.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            grandTotal: grandTotal.toFixed(2)
        };
    };

    // Save billing
    const handleSaveBilling = async () => {
        setSaving(true);
        try {
            await api.put(`/jobcards/${jobCard._id}/billing`, {
                spareParts,
                serviceCosts,
                discount,
                discountType
            });

            alert("Billing saved successfully!");
            onUpdate(); // Refresh job card data
        } catch (error) {
            alert("Failed to save billing: " + (error.response?.data?.msg || error.message));
        } finally {
            setSaving(false);
        }
    };

    // Update payment status
    const handlePaymentStatusUpdate = async (newStatus) => {
        try {
            await api.patch(`/jobcards/${jobCard._id}/payment-status`, {
                paymentStatus: newStatus
            });

            alert("Payment status updated!");
            onUpdate();
        } catch (error) {
            alert("Failed to update payment status: " + (error.response?.data?.msg || error.message));
        }
    };

    const totals = calculateTotals();

    // Only show billing for done or closed jobs
    if (jobCard.status !== "done" && jobCard.status !== "closed") {
        return null;
    }

    return (
        <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
                Billing & Invoice
            </h2>

            {/* Spare Parts Section */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-700">Spare Parts</h3>
                    {canEditBilling && (
                        <button onClick={addSparePart} className="btn-primary text-sm px-3 py-1">
                            + Add Part
                        </button>
                    )}
                </div>

                {spareParts.length === 0 ? (
                    <p className="text-slate-500 text-sm">No spare parts added</p>
                ) : (
                    <div className="space-y-3">
                        {spareParts.map((part, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-3 rounded-lg">
                                <div className="col-span-4">
                                    <label className="text-xs text-slate-600">Part Name</label>
                                    <input
                                        type="text"
                                        value={part.name}
                                        onChange={(e) => updateSparePart(index, "name", e.target.value)}
                                        className="input-field text-sm"
                                        disabled={!canEditBilling}
                                        placeholder="Part name"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-600">Part #</label>
                                    <input
                                        type="text"
                                        value={part.partNumber || ""}
                                        onChange={(e) => updateSparePart(index, "partNumber", e.target.value)}
                                        className="input-field text-sm"
                                        disabled={!canEditBilling}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-600">Qty</label>
                                    <input
                                        type="number"
                                        value={part.quantity}
                                        onChange={(e) => updateSparePart(index, "quantity", Number(e.target.value))}
                                        className="input-field text-sm"
                                        disabled={!canEditBilling}
                                        min="1"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-600">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={part.unitPrice}
                                        onChange={(e) => updateSparePart(index, "unitPrice", Number(e.target.value))}
                                        className="input-field text-sm"
                                        disabled={!canEditBilling}
                                        min="0"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-xs text-slate-600">Total</label>
                                    <p className="font-bold text-sm">₹{part.total || 0}</p>
                                </div>
                                {canEditBilling && (
                                    <div className="col-span-1">
                                        <button
                                            onClick={() => removeSparePart(index)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Service Costs Section */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-700">Service Costs</h3>
                    {canEditBilling && (
                        <button onClick={addServiceCost} className="btn-primary text-sm px-3 py-1">
                            + Add Service
                        </button>
                    )}
                </div>

                {serviceCosts.length === 0 ? (
                    <p className="text-slate-500 text-sm">No service costs added</p>
                ) : (
                    <div className="space-y-3">
                        {serviceCosts.map((service, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-3 rounded-lg">
                                <div className="col-span-8">
                                    <label className="text-xs text-slate-600">Service Description</label>
                                    <input
                                        type="text"
                                        value={service.description}
                                        onChange={(e) => updateServiceCost(index, "description", e.target.value)}
                                        className="input-field text-sm"
                                        disabled={!canEditBilling}
                                        placeholder="Service description"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="text-xs text-slate-600">Cost (₹)</label>
                                    <input
                                        type="number"
                                        value={service.cost}
                                        onChange={(e) => updateServiceCost(index, "cost", Number(e.target.value))}
                                        className="input-field text-sm"
                                        disabled={!canEditBilling}
                                        min="0"
                                    />
                                </div>
                                {canEditBilling && (
                                    <div className="col-span-1">
                                        <button
                                            onClick={() => removeServiceCost(index)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Discount Section */}
            {canEditBilling && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Discount Type
                        </label>
                        <select
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                            className="input-field"
                        >
                            <option value="fixed">Fixed Amount (₹)</option>
                            <option value="percentage">Percentage (%)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Discount Value
                        </label>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                            className="input-field"
                            min="0"
                            placeholder="0"
                        />
                    </div>
                </div>
            )}

            {/* Billing Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold text-slate-800 mb-3">Billing Summary</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-semibold">₹{totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Discount:</span>
                        <span className="font-semibold text-red-600">- ₹{totals.discountAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax (GST 18%):</span>
                        <span className="font-semibold">+ ₹{totals.taxAmount}</span>
                    </div>
                    <div className="border-t-2 border-slate-300 pt-2 mt-2">
                        <div className="flex justify-between">
                            <span className="font-bold text-slate-800">Grand Total:</span>
                            <span className="font-bold text-xl text-blue-600">₹{totals.grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Info */}
            {jobCard.invoiceNumber && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-600">Invoice Number</p>
                            <p className="font-bold text-lg">{jobCard.invoiceNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Invoice Date</p>
                            <p className="font-semibold">{new Date(jobCard.invoiceDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Payment Status</p>
                            <span className={`badge ${jobCard.paymentStatus === "paid" ? "badge-done" :
                                    jobCard.paymentStatus === "partial" ? "badge-awaiting-parts" :
                                        "badge-new"
                                }`}>
                                {jobCard.paymentStatus?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                {canEditBilling && (
                    <button
                        onClick={handleSaveBilling}
                        disabled={saving}
                        className="btn-primary flex-1"
                    >
                        {saving ? "Saving..." : "Save Billing"}
                    </button>
                )}

                {canUpdatePayment && jobCard.invoiceNumber && (
                    <div className="flex gap-2 flex-1">
                        <button
                            onClick={() => handlePaymentStatusUpdate("partial")}
                            className="btn-secondary flex-1 text-sm"
                            disabled={jobCard.paymentStatus === "paid"}
                        >
                            Mark Partial
                        </button>
                        <button
                            onClick={() => handlePaymentStatusUpdate("paid")}
                            className="btn-success flex-1 text-sm"
                            disabled={jobCard.paymentStatus === "paid"}
                        >
                            Mark Paid
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
