'use client';
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, PercentIcon, TagIcon, TimerIcon, BanknoteIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, AlertCircle, Calendar, Clock, Tag, ShoppingBag, BarChart2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { PromoCode } from "@/types";

interface PromoCodeStats {
    totalCodes: number;
    activeCodes: number;
    totalUsage: number;
    totalDiscounts: number;
}

export default function PromoCodesPage() {
    const { toast } = useToast();
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        discountType: "percentage",
        expiresAt: "",
        minPurchaseAmount: "0",
        maxDiscount: "",
        usageLimit: "",
        description: "",
        isActive: true,
    });
    const [stats, setStats] = useState<PromoCodeStats>({
        totalCodes: 0,
        activeCodes: 0,
        totalUsage: 0,
        totalDiscounts: 0
    });
    const [usageData, setUsageData] = useState([]);

    const fetchPromoCodes = async () => {
        try {
            const res = await fetch("/api/promo-codes");
            const data = await res.json();
            setPromoCodes(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to fetch promo codes",
            });
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/promo-codes/stats");
            const data = await res.json();
            setStats(data.stats);
            setUsageData(data.usageData);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to fetch statistics",
            });
        }
    };

    useEffect(() => {
        fetchPromoCodes();
        fetchStats();
    }, []);

    const createPromo = async () => {
        try {
            if (!formData.code || !formData.discount || !formData.expiresAt) {
                toast({
                    variant: "destructive",
                    title: "Please fill in all required fields",
                });
                return;
            }

            const res = await fetch("/api/promo-codes", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create promo code");

            toast({
                title: "Promo code created successfully",
            });
            await fetchPromoCodes();
            // Reset form
            setFormData({
                code: "",
                discount: "",
                discountType: "percentage",
                expiresAt: "",
                minPurchaseAmount: "0",
                maxDiscount: "",
                usageLimit: "",
                description: "",
                isActive: true,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to create promo code",
            });
        }
    };

    const togglePromoStatus = async (id: string, currentStatus: boolean) => {
        try {
            await fetch("/api/promo-codes", {
                method: "PATCH",
                body: JSON.stringify({ _id: id, isActive: !currentStatus }),
            });
            await fetchPromoCodes();
            toast({
                title: "Status updated successfully",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to update status",
            });
        }
    };

    const deletePromo = async (id: string) => {
        try {
            await fetch("/api/promo-codes", {
                method: "DELETE",
                body: JSON.stringify({ id }),
            });
            await fetchPromoCodes();
            toast({
                title: "Promo code deleted successfully",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to delete promo code",
            });
        }
    };

    const StatCard = ({ title, value, icon, trend }: any) => (
        <Card className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                    {trend && (
                        <p className={`text-sm mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                            {Math.abs(trend)}% from last month
                        </p>
                    )}
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                    {icon}
                </div>
            </div>
        </Card>
    );

    const discountTypeInfo = {
        percentage: {
            description: "Discount applied as a percentage of purchase amount",
            example: "20% off the total purchase",
            maxValue: 100
        },
        fixed: {
            description: "Fixed amount discount",
            example: "$10 off the purchase",
            maxValue: 1000
        }
    };

    const renderInfoTooltip = (content: string) => (
        <TooltipProvider>
            <UITooltip>
                <TooltipTrigger>
                    <InfoIcon className="w-4 h-4 text-muted-foreground ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">{content}</p>
                </TooltipContent>
            </UITooltip>
        </TooltipProvider>
    );

    const isExpiringSoon = (date: string) => {
        const expiryDate = new Date(date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    };

    const isExpired = (date: string) => {
        return new Date(date) < new Date();
    };

    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Promo Codes"
                    value={stats.totalCodes}
                    icon={<TagIcon className="w-6 h-6 text-primary" />}
                />
                <StatCard
                    title="Active Codes"
                    value={stats.activeCodes}
                    icon={<TimerIcon className="w-6 h-6 text-primary" />}
                    trend={5}
                />
                <StatCard
                    title="Total Usage"
                    value={stats.totalUsage}
                    icon={<PercentIcon className="w-6 h-6 text-primary" />}
                    trend={-2}
                />
                <StatCard
                    title="Total Discounts"
                    value={`$${stats.totalDiscounts.toFixed(2)}`}
                    icon={<BanknoteIcon className="w-6 h-6 text-primary" />}
                    trend={8}
                />
            </div>

            {/* Usage Chart */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Promo Code Usage</h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={usageData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="usage" stroke="#2563eb" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Create Promo Code Form */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Create Promo Code</h2>
                    <Button variant="outline" onClick={() => setFormData({
                        code: "",
                        discount: "",
                        discountType: "percentage",
                        expiresAt: "",
                        minPurchaseAmount: "0",
                        maxDiscount: "",
                        usageLimit: "",
                        description: "",
                        isActive: true,
                    })}>
                        Reset Form
                    </Button>
                </div>

                <Accordion type="single" collapsible className="mb-6">
                    <AccordionItem value="guidelines">
                        <AccordionTrigger>Promo Code Guidelines</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Code must be unique and at least 3 characters</li>
                                <li>Percentage discounts must be between 1-100%</li>
                                <li>Fixed discounts must not exceed $1000</li>
                                <li>Expiry date must be in the future</li>
                                <li>Usage limit is optional but recommended</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                            Promo Code*
                            {renderInfoTooltip("Unique identifier for this promotion")}
                        </label>
                        <Input
                            placeholder="e.g., SUMMER2024"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                            Discount Type
                            {renderInfoTooltip("Choose between percentage or fixed amount discount")}
                        </label>
                        <Select
                            value={formData.discountType}
                            onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            {discountTypeInfo[formData.discountType as keyof typeof discountTypeInfo].example}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                            Discount Amount*
                            {renderInfoTooltip(
                                `Enter amount ${formData.discountType === 'percentage' ? '(1-100%)' : '(max $1000)'}`
                            )}
                        </label>
                        <Input
                            type="number"
                            min="0"
                            max={discountTypeInfo[formData.discountType as keyof typeof discountTypeInfo].maxValue}
                            placeholder={formData.discountType === 'percentage' ? "e.g., 20" : "e.g., 10"}
                            value={formData.discount}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                const max = discountTypeInfo[formData.discountType as keyof typeof discountTypeInfo].maxValue;
                                if (value <= max) {
                                    setFormData({ ...formData, discount: e.target.value });
                                }
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                            Expiry Date*
                            {renderInfoTooltip("When this promo code will expire")}
                        </label>
                        <Input
                            type="datetime-local"
                            min={new Date().toISOString().slice(0, 16)}
                            value={formData.expiresAt}
                            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        />
                    </div>

                    {/* Add validation alerts */}
                    {parseFloat(formData.discount) > discountTypeInfo[formData.discountType as keyof typeof discountTypeInfo].maxValue && (
                        <Alert variant="destructive" className="col-span-full">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                The discount amount exceeds the maximum allowed value
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                            Minimum Purchase
                            {renderInfoTooltip("Minimum order amount required to use this code")}
                        </label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 50"
                            value={formData.minPurchaseAmount}
                            onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                            Usage Limit
                            {renderInfoTooltip("Maximum number of times this code can be used")}
                        </label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="Leave empty for unlimited"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="text-sm font-medium flex items-center">
                            Description
                            {renderInfoTooltip("Internal note about this promo code")}
                        </label>
                        <Input
                            placeholder="Optional description for internal reference"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                        <label className="text-sm font-medium">Active</label>
                        {renderInfoTooltip("Toggle to enable/disable this promo code")}
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <Button 
                        onClick={createPromo}
                        disabled={!formData.code || !formData.discount || !formData.expiresAt}
                    >
                        Create Promo Code
                    </Button>
                    <Button variant="outline" onClick={() => setFormData({
                        code: "",
                        discount: "",
                        discountType: "percentage",
                        expiresAt: "",
                        minPurchaseAmount: "0",
                        maxDiscount: "",
                        usageLimit: "",
                        description: "",
                        isActive: true,
                    })}>
                        Clear
                    </Button>
                </div>
            </Card>

            {/* Promo Codes List with Enhanced Details */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Promo Codes</h2>
                    <Select
                        defaultValue="all"
                        onValueChange={(value) => {
                            // Add filter functionality here
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Codes</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="expiring">Expiring Soon</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    {promoCodes.map((code) => (
                        <Card key={code._id} className="p-6">
                            <div className="space-y-4">
                                {/* Header Section */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-primary" />
                                            <h3 className="text-xl font-semibold">{code.code}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{code.description || "No description provided"}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isExpiringSoon(code.expiresAt) && (
                                            <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Expiring Soon
                                            </Badge>
                                        )}
                                        {isExpired(code.expiresAt) ? (
                                            <Badge variant="destructive">Expired</Badge>
                                        ) : (
                                            code.isActive ? (
                                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <ShoppingBag className="w-4 h-4 mr-1" />
                                            Discount
                                        </div>
                                        <p className="font-medium">
                                            {code.discount}{code.discountType === 'percentage' ? '%' : '$'} off
                                            {code.maxDiscount && code.discountType === 'percentage' && (
                                                <span className="text-sm text-muted-foreground ml-1">
                                                    (Max ${code.maxDiscount})
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <BarChart2 className="w-4 h-4 mr-1" />
                                            Usage
                                        </div>
                                        <p className="font-medium">
                                            {code.usageCount || 0}
                                            {code.usageLimit && (
                                                <span className="text-sm text-muted-foreground">/{code.usageLimit}</span>
                                            )}
                                            <span className="text-sm text-muted-foreground ml-1">times used</span>
                                        </p>
                                        {code.usageLimit && (
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-primary rounded-full h-1.5"
                                                    style={{
                                                        width: `${(code.usageCount / code.usageLimit) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <ShoppingBag className="w-4 h-4 mr-1" />
                                            Minimum Purchase
                                        </div>
                                        <p className="font-medium">
                                            ${code.minPurchaseAmount || 0}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Expiry
                                        </div>
                                        <p className="font-medium">
                                            {formatDateTime(code.expiresAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline and Additional Info */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium mb-2">Timeline</h4>
                                        <div className="text-sm space-y-1">
                                            <p className="text-muted-foreground">
                                                Created: {new Date(code.createdAt).toLocaleString()}
                                            </p>
                                            <p className="text-muted-foreground">
                                                Last Updated: {new Date(code.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end items-center gap-2 pt-4 border-t">
                                    <Switch
                                        checked={code.isActive}
                                        onCheckedChange={() => togglePromoStatus(code._id, code.isActive)}
                                    />
                                    <Button variant="outline" size="sm">
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={() => deletePromo(code._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
}