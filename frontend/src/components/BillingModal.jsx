import React, { useState, useEffect } from "react";
import api from "../lib/api";
import inventoryService from "../services/inventoryService";
import { useToast } from "./ToastProvider";

export default function BillingModal({ jobCard, isOpen, onClose, onUpdate, userRole }) {
    const { showToast } = useToast();
    const [spareParts, setSpareParts] = useState([]);
    const [serviceCosts, setServiceCosts] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState("fixed");
    const [saving, setSaving] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
    const [searchQuery, setSearchQuery] = useState("");

    // Check if user can edit billing
    const canEditBilling = ["admin", "manager", "cashier", "service_advisor"].includes(userRole);
    const canUpdatePayment = ["admin", "manager", "cashier"].includes(userRole);

    // Load billing data when modal opens
    useEffect(() => {
        if (isOpen && jobCard) {
            setSpareParts(jobCard.spareParts || []);
            setServiceCosts(jobCard.serviceCosts || []);
            setDiscount(jobCard.billing?.discount || 0);
            setDiscountType(jobCard.billing?.discountType || "fixed");
        }
    }, [isOpen, jobCard]);

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Add new spare part
    const addSparePart = () => {
        setSpareParts([...spareParts, { name: "", partNumber: "", quantity: 1, unitPrice: 0, total: 0 }]);
    };

    // Update spare part
    const updateSparePart = (index, field, value) => {
        const updated = [...spareParts];
        updated[index][field] = value;

        if (field === "quantity" || field === "unitPrice") {
            updated[index].total = updated[index].quantity * updated[index].unitPrice;
        }

        setSpareParts(updated);
    };

    // Search parts from inventory
    const handlePartSearch = async (query, index) => {
        setSearchQuery(query);
        setActiveSearchIndex(index);

        if (query.length < 2) {
            setSearchSuggestions([]);
            return;
        }

        const results = await inventoryService.searchParts(query);
        setSearchSuggestions(results);
    };

    // Select part from suggestions
    const selectPart = (part, index) => {
        const updated = [...spareParts];
        updated[index] = {
            name: part.name,
            partNumber: part.partNumber,
            quantity: updated[index].quantity || 1,
            unitPrice: part.price,
            total: (updated[index].quantity || 1) * part.price,
            stock: part.stock,
            category: part.category
        };
        setSpareParts(updated);
        setSearchSuggestions([]);
        setActiveSearchIndex(-1);
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
        const taxAmount = (afterDiscount * 18) / 100;
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
            showToast("Billing saved successfully!", "success");
            onUpdate();
            onClose();
        } catch (error) {
            showToast("Failed to save billing: " + (error.response?.data?.msg || error.message), "error");
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
            showToast("Payment status updated!", "success");
            onUpdate();
        } catch (error) {
            showToast("Failed to update payment status: " + (error.response?.data?.msg || error.message), "error");
        }
    };

    const totals = calculateTotals();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1B5E7E] to-[#2E8BA6] text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Billing & Invoice</h2>
                        <p className="text-sm opacity-90">Job Card: {jobCard.jobNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Spare Parts Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">📦 Spare Parts</h3>
                            {canEditBilling && (
                                <button onClick={addSparePart} className="btn-primary text-sm px-4 py-2">
                                    + Add Part
                                </button>
                            )}
                        </div>

                        {spareParts.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-lg">
                                <p className="text-slate-500">No spare parts added yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {spareParts.map((part, index) => (
                                    <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <div className="grid grid-cols-12 gap-3 items-end">
                                            <div className="col-span-4">
                                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Part Name *</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={part.name}
                                                        onChange={(e) => {
                                                            updateSparePart(index, "name", e.target.value);
                                                            handlePartSearch(e.target.value, index);
                                                        }}
                                                        onFocus={() => {
                                                            if (part.name.length >= 2) {
                                                                handlePartSearch(part.name, index);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            // Delay to allow click on suggestion
                                                            setTimeout(() => setSearchSuggestions([]), 200);
                                                        }}
                                                        className="input-field"
                                                        disabled={!canEditBilling}
                                                        placeholder="Search parts..."
                                                    />
                                                    {/* Autocomplete Suggestions */}
                                                    {canEditBilling && activeSearchIndex === index && searchSuggestions.length > 0 && (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                            {searchSuggestions.map((suggestion, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    onClick={() => selectPart(suggestion, index)}
                                                                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                                                                >
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="flex-1">
                                                                            <p className="font-semibold text-slate-900">{suggestion.name}</p>
                                                                            <p className="text-xs text-slate-500">{suggestion.partNumber} • {suggestion.category}</p>
                                                                        </div>
                                                                        <div className="text-right ml-3">
                                                                            <p className="font-bold text-blue-600">₹{suggestion.price}</p>
                                                                            <p className={`text-xs ${suggestion.stock > 10 ? 'text-green-600' :
                                                                                suggestion.stock > 0 ? 'text-orange-600' :
                                                                                    'text-red-600'
                                                                                }`}>
                                                                                {suggestion.stock > 10 ? '✓ In Stock' :
                                                                                    suggestion.stock > 0 ? `⚠ ${suggestion.stock} left` :
                                                                                        '✗ Out of Stock'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Stock Indicator */}
                                                {part.stock !== undefined && (
                                                    <p className={`text-xs mt-1 ${part.stock > 10 ? 'text-green-600' :
                                                        part.stock > 0 ? 'text-orange-600' :
                                                            'text-red-600'
                                                        }`}>
                                                        {part.stock > 10 ? `✓ ${part.stock} in stock` :
                                                            part.stock > 0 ? `⚠ Only ${part.stock} left` :
                                                                '✗ Out of stock'}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Part Number</label>
                                                <input
                                                    type="text"
                                                    value={part.partNumber || ""}
                                                    onChange={(e) => updateSparePart(index, "partNumber", e.target.value)}
                                                    className="input-field"
                                                    disabled={!canEditBilling}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Quantity *</label>
                                                <input
                                                    type="number"
                                                    value={part.quantity}
                                                    onChange={(e) => updateSparePart(index, "quantity", Number(e.target.value))}
                                                    className="input-field"
                                                    disabled={!canEditBilling}
                                                    min="1"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Unit Price (₹) *</label>
                                                <input
                                                    type="number"
                                                    value={part.unitPrice}
                                                    onChange={(e) => updateSparePart(index, "unitPrice", Number(e.target.value))}
                                                    className="input-field"
                                                    disabled={!canEditBilling}
                                                    min="0"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Total</label>
                                                <p className="font-bold text-blue-600">₹{part.total || 0}</p>
                                            </div>
                                            {canEditBilling && (
                                                <div className="col-span-1 flex justify-end">
                                                    <button
                                                        onClick={() => removeSparePart(index)}
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"
                                                        title="Remove part"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Service Costs Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">🔧 Service Costs</h3>
                            {canEditBilling && (
                                <button onClick={addServiceCost} className="btn-primary text-sm px-4 py-2">
                                    + Add Service
                                </button>
                            )}
                        </div>

                        {serviceCosts.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-lg">
                                <p className="text-slate-500">No service costs added yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {serviceCosts.map((service, index) => (
                                    <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <div className="grid grid-cols-12 gap-3 items-end">
                                            <div className="col-span-9">
                                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Service Description *</label>
                                                <input
                                                    type="text"
                                                    value={service.description}
                                                    onChange={(e) => updateServiceCost(index, "description", e.target.value)}
                                                    className="input-field"
                                                    disabled={!canEditBilling}
                                                    placeholder="Enter service description"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Cost (₹) *</label>
                                                <input
                                                    type="number"
                                                    value={service.cost}
                                                    onChange={(e) => updateServiceCost(index, "cost", Number(e.target.value))}
                                                    className="input-field"
                                                    disabled={!canEditBilling}
                                                    min="0"
                                                />
                                            </div>
                                            {canEditBilling && (
                                                <div className="col-span-1 flex justify-end">
                                                    <button
                                                        onClick={() => removeServiceCost(index)}
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"
                                                        title="Remove service"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Discount Section */}
                    {canEditBilling && (
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">💸 Discount</h3>
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
                        </div>
                    )}


                    {/* Payment Status Section - ALWAYS VISIBLE for authorized users */}
                    {canUpdatePayment && (
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">💳 Payment Status</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Current Status
                                    </label>
                                    <select
                                        value={jobCard.paymentStatus || "pending"}
                                        onChange={(e) => handlePaymentStatusUpdate(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="pending">🟠 Pending - Payment not received</option>
                                        <option value="partial">🔵 Partial - Some amount received</option>
                                        <option value="paid">🟢 Paid - Full amount settled</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-600 mb-1">Status Preview</p>
                                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold w-full text-center ${(jobCard.paymentStatus || 'pending') === "paid" ? "bg-green-500 text-white" :
                                            (jobCard.paymentStatus || 'pending') === "partial" ? "bg-blue-500 text-white" :
                                                "bg-orange-400 text-white"
                                        }`}>
                                        {(jobCard.paymentStatus || 'PENDING').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Billing Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border-2 border-blue-300">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">📊 Billing Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-base">
                                <span className="text-slate-700">Subtotal:</span>
                                <span className="font-bold text-slate-900">₹ {totals.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-slate-700">Discount:</span>
                                <span className="font-bold text-red-600">- ₹ {totals.discountAmount}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-slate-700">Tax (GST 18%):</span>
                                <span className="font-bold text-slate-900">+ ₹ {totals.taxAmount}</span>
                            </div>
                            <div className="border-t-2 border-blue-400 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-slate-900">Grand Total:</span>
                                    <span className="text-3xl font-bold text-blue-600">₹ {totals.grandTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice & Payment Info */}
                    {jobCard.invoiceNumber && (
                        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">🧾 Invoice Details</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Invoice Number</p>
                                    <p className="font-bold text-lg text-slate-900">{jobCard.invoiceNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Invoice Date</p>
                                    <p className="font-semibold text-slate-900">{new Date(jobCard.invoiceDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Payment Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${jobCard.paymentStatus === "paid" ? "bg-green-500 text-white" :
                                        jobCard.paymentStatus === "partial" ? "bg-orange-500 text-white" :
                                            "bg-slate-400 text-white"
                                        }`}>
                                        {jobCard.paymentStatus?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-100 p-6 flex gap-3 border-t border-slate-300">
                    <button
                        onClick={onClose}
                        className="btn-outline flex-1"
                    >
                        Cancel
                    </button>

                    {canEditBilling && (
                        <button
                            onClick={handleSaveBilling}
                            disabled={saving}
                            className="btn-primary flex-1"
                        >
                            {saving ? "Saving..." : "💾 Save Billing"}
                        </button>
                    )}

                    {canUpdatePayment && jobCard.invoiceNumber && jobCard.paymentStatus !== "paid" && (
                        <>
                            <button
                                onClick={() => handlePaymentStatusUpdate("partial")}
                                className="btn-secondary flex-1"
                            >
                                Mark Partial
                            </button>
                            <button
                                onClick={() => handlePaymentStatusUpdate("paid")}
                                className="btn-success flex-1"
                            >
                                ✓ Mark Paid
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
