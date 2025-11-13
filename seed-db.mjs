#!/usr/bin/env node

/**
 * سكريبت البيانات التجريبية - نظام العباسي رقم 5
 * Seed Data Script - Al-Abasi System 5
 * 
 * يقوم بملء قاعدة البيانات ببيانات تجريبية لتسهيل الاختبار
 * Fills the database with sample data for easy testing
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

// الاتصال بقاعدة البيانات
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🌱 بدء إضافة البيانات التجريبية...');
console.log('🌱 Starting seed data insertion...\n');

// فحص إذا كانت البيانات موجودة مسبقاً
const existingCurrencies = await db.select().from(schema.currencies).limit(1);
if (existingCurrencies.length > 0) {
  console.log('⚠️  البيانات موجودة مسبقاً! استخدم الأمر التالي لحذف البيانات القديمة:');
  console.log('⚠️  Data already exists! Use the following command to delete old data:');
  console.log('   pnpm db:push  (لإعادة إنشاء الجداول)\n');
  await connection.end();
  process.exit(0);
}

// ============ 1. العملات ============
console.log('💰 إضافة العملات...');
const currencies = await db.insert(schema.currencies).values([
  {
    code: 'SAR',
    nameAr: 'ريال سعودي',
    nameEn: 'Saudi Riyal',
    symbol: 'ر.س',
    isActive: true,
  },
  {
    code: 'USD',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    symbol: '$',
    isActive: true,
  },
  {
    code: 'EUR',
    nameAr: 'يورو',
    nameEn: 'Euro',
    symbol: '€',
    isActive: true,
  },
]);
console.log('✅ تم إضافة 3 عملات\n');

// ============ 2. الفروع ============
console.log('🏢 إضافة الفروع...');
const branches = await db.insert(schema.branches).values([
  {
    code: 'MAIN',
    nameAr: 'الفرع الرئيسي',
    nameEn: 'Main Branch',
    isMain: true,
    isActive: true,
  },
  {
    code: 'BR001',
    nameAr: 'فرع الرياض',
    nameEn: 'Riyadh Branch',
    isMain: false,
    isActive: true,
  },
]);
console.log('✅ تم إضافة 2 فرع\n');

// ============ 3. الوحدات ============
console.log('📦 إضافة الوحدات...');
const units = await db.insert(schema.units).values([
  { code: 'PCS', nameAr: 'قطعة', nameEn: 'Piece', isActive: true },
  { code: 'KG', nameAr: 'كيلوجرام', nameEn: 'Kilogram', isActive: true },
  { code: 'M', nameAr: 'متر', nameEn: 'Meter', isActive: true },
  { code: 'BOX', nameAr: 'صندوق', nameEn: 'Box', isActive: true },
]);
console.log('✅ تم إضافة 4 وحدات\n');

// ============ 4. المؤسسات ============
console.log('🏛️ إضافة المؤسسات...');
const organizations = await db.insert(schema.organizations).values([
  {
    code: 'ORG001',
    nameAr: 'مؤسسة العباسي التجارية',
    nameEn: 'Al-Abasi Trading Est.',
    taxNumber: '300000000000003',
    email: 'info@alabasi.com',
    phone: '+966501234567',
    isActive: true,
  },
]);
console.log('✅ تم إضافة مؤسسة واحدة\n');

// ============ 5. تصنيفات الحسابات ============
console.log('📂 إضافة تصنيفات الحسابات...');
const categories = await db.insert(schema.accountCategories).values([
  { code: '1', nameAr: 'الأصول', nameEn: 'Assets', type: 'asset' },
  { code: '2', nameAr: 'الخصوم', nameEn: 'Liabilities', type: 'liability' },
  { code: '3', nameAr: 'حقوق الملكية', nameEn: 'Equity', type: 'equity' },
  { code: '4', nameAr: 'الإيرادات', nameEn: 'Revenue', type: 'revenue' },
  { code: '5', nameAr: 'المصروفات', nameEn: 'Expenses', type: 'expense' },
]);
console.log('✅ تم إضافة 5 تصنيفات\n');

// ============ 6. دليل الحسابات ============
console.log('📖 إضافة دليل الحسابات...');

// الأصول
const assets = await db.insert(schema.chartOfAccounts).values([
  // الأصول المتداولة
  { code: '1000', nameAr: 'الأصول المتداولة', nameEn: 'Current Assets', categoryId: 1, isParent: true, isActive: true },
  { code: '1010', nameAr: 'النقدية بالصندوق', nameEn: 'Cash on Hand', categoryId: 1, parentId: null, isParent: false, isActive: true },
  { code: '1020', nameAr: 'البنوك', nameEn: 'Banks', categoryId: 1, parentId: null, isParent: false, isActive: true },
  { code: '1030', nameAr: 'العملاء', nameEn: 'Accounts Receivable', categoryId: 1, parentId: null, isParent: false, isActive: true },
  { code: '1040', nameAr: 'المخزون', nameEn: 'Inventory', categoryId: 1, parentId: null, isParent: false, isActive: true },
  
  // الأصول الثابتة
  { code: '1500', nameAr: 'الأصول الثابتة', nameEn: 'Fixed Assets', categoryId: 1, isParent: true, isActive: true },
  { code: '1510', nameAr: 'الأراضي', nameEn: 'Land', categoryId: 1, parentId: null, isParent: false, isActive: true },
  { code: '1520', nameAr: 'المباني', nameEn: 'Buildings', categoryId: 1, parentId: null, isParent: false, isActive: true },
  { code: '1530', nameAr: 'السيارات', nameEn: 'Vehicles', categoryId: 1, parentId: null, isParent: false, isActive: true },
  { code: '1540', nameAr: 'الأثاث والمعدات', nameEn: 'Furniture & Equipment', categoryId: 1, parentId: null, isParent: false, isActive: true },
]);

// الخصوم
const liabilities = await db.insert(schema.chartOfAccounts).values([
  { code: '2000', nameAr: 'الخصوم المتداولة', nameEn: 'Current Liabilities', categoryId: 2, isParent: true, isActive: true },
  { code: '2010', nameAr: 'الموردون', nameEn: 'Accounts Payable', categoryId: 2, parentId: null, isParent: false, isActive: true },
  { code: '2020', nameAr: 'القروض قصيرة الأجل', nameEn: 'Short-term Loans', categoryId: 2, parentId: null, isParent: false, isActive: true },
  { code: '2030', nameAr: 'الرواتب المستحقة', nameEn: 'Salaries Payable', categoryId: 2, parentId: null, isParent: false, isActive: true },
  
  { code: '2500', nameAr: 'الخصوم طويلة الأجل', nameEn: 'Long-term Liabilities', categoryId: 2, isParent: true, isActive: true },
  { code: '2510', nameAr: 'القروض طويلة الأجل', nameEn: 'Long-term Loans', categoryId: 2, parentId: null, isParent: false, isActive: true },
]);

// حقوق الملكية
const equity = await db.insert(schema.chartOfAccounts).values([
  { code: '3000', nameAr: 'رأس المال', nameEn: 'Capital', categoryId: 3, isParent: false, isActive: true },
  { code: '3010', nameAr: 'الأرباح المحتجزة', nameEn: 'Retained Earnings', categoryId: 3, isParent: false, isActive: true },
  { code: '3020', nameAr: 'أرباح العام الحالي', nameEn: 'Current Year Profit', categoryId: 3, isParent: false, isActive: true },
]);

// الإيرادات
const revenue = await db.insert(schema.chartOfAccounts).values([
  { code: '4000', nameAr: 'إيرادات المبيعات', nameEn: 'Sales Revenue', categoryId: 4, isParent: false, isActive: true },
  { code: '4010', nameAr: 'إيرادات الخدمات', nameEn: 'Service Revenue', categoryId: 4, isParent: false, isActive: true },
  { code: '4020', nameAr: 'إيرادات أخرى', nameEn: 'Other Revenue', categoryId: 4, isParent: false, isActive: true },
]);

// المصروفات
const expenses = await db.insert(schema.chartOfAccounts).values([
  { code: '5000', nameAr: 'تكلفة البضاعة المباعة', nameEn: 'Cost of Goods Sold', categoryId: 5, isParent: false, isActive: true },
  { code: '5010', nameAr: 'مصروفات الرواتب', nameEn: 'Salaries Expense', categoryId: 5, isParent: false, isActive: true },
  { code: '5020', nameAr: 'مصروفات الإيجار', nameEn: 'Rent Expense', categoryId: 5, isParent: false, isActive: true },
  { code: '5030', nameAr: 'مصروفات الكهرباء', nameEn: 'Electricity Expense', categoryId: 5, isParent: false, isActive: true },
  { code: '5040', nameAr: 'مصروفات الصيانة', nameEn: 'Maintenance Expense', categoryId: 5, isParent: false, isActive: true },
  { code: '5050', nameAr: 'مصروفات التسويق', nameEn: 'Marketing Expense', categoryId: 5, isParent: false, isActive: true },
  { code: '5060', nameAr: 'مصروفات عمومية', nameEn: 'General Expenses', categoryId: 5, isParent: false, isActive: true },
]);

console.log('✅ تم إضافة 30+ حساب\n');

// ============ 7. أنواع الحسابات التحليلية ============
console.log('🔍 إضافة أنواع الحسابات التحليلية...');
const analyticalTypes = await db.insert(schema.analyticalAccountTypes).values([
  { code: 'CASH', nameAr: 'الصناديق', nameEn: 'Cash Boxes', isActive: true },
  { code: 'BANK', nameAr: 'البنوك', nameEn: 'Banks', isActive: true },
  { code: 'CUSTOMER', nameAr: 'العملاء', nameEn: 'Customers', isActive: true },
  { code: 'SUPPLIER', nameAr: 'الموردون', nameEn: 'Suppliers', isActive: true },
  { code: 'EMPLOYEE', nameAr: 'الموظفون', nameEn: 'Employees', isActive: true },
]);
console.log('✅ تم إضافة 5 أنواع\n');

// ============ 8. الحسابات التحليلية ============
console.log('💼 إضافة الحسابات التحليلية...');
const analyticalAccounts = await db.insert(schema.analyticalAccounts).values([
  // الصناديق
  { code: 'CASH001', nameAr: 'صندوق الفرع الرئيسي', nameEn: 'Main Branch Cash', accountId: null, typeId: 1, isActive: true },
  { code: 'CASH002', nameAr: 'صندوق فرع الرياض', nameEn: 'Riyadh Branch Cash', accountId: null, typeId: 1, isActive: true },
  
  // البنوك
  { code: 'BANK001', nameAr: 'البنك الأهلي - حساب جاري', nameEn: 'Al Ahli Bank - Current', accountId: null, typeId: 2, isActive: true },
  { code: 'BANK002', nameAr: 'بنك الراجحي - حساب جاري', nameEn: 'Al Rajhi Bank - Current', accountId: null, typeId: 2, isActive: true },
  
  // العملاء
  { code: 'CUST001', nameAr: 'شركة النور التجارية', nameEn: 'Al Noor Trading Co.', accountId: null, typeId: 3, isActive: true },
  { code: 'CUST002', nameAr: 'مؤسسة الفجر', nameEn: 'Al Fajr Est.', accountId: null, typeId: 3, isActive: true },
  { code: 'CUST003', nameAr: 'شركة الأمل', nameEn: 'Al Amal Company', accountId: null, typeId: 3, isActive: true },
  
  // الموردون
  { code: 'SUPP001', nameAr: 'مورد البضائع الأول', nameEn: 'First Goods Supplier', accountId: null, typeId: 4, isActive: true },
  { code: 'SUPP002', nameAr: 'مورد الخدمات', nameEn: 'Services Supplier', accountId: null, typeId: 4, isActive: true },
]);
console.log('✅ تم إضافة 9 حسابات تحليلية\n');

// ============ 9. الموظفون ============
console.log('👥 إضافة الموظفين...');
const employees = await db.insert(schema.employees).values([
  {
    code: 'EMP001',
    nameAr: 'أحمد محمد',
    nameEn: 'Ahmed Mohammed',
    phone: '+966501111111',
    email: 'ahmed@alabasi.com',
    position: 'مدير عام',
    branchId: 1,
    salary: 1500000, // 15000 ريال بالقروش
    currencyId: 1, // SAR
    hireDate: new Date('2023-01-01'),
    isActive: true,
  },
  {
    code: 'EMP002',
    nameAr: 'فاطمة علي',
    nameEn: 'Fatima Ali',
    phone: '+966502222222',
    email: 'fatima@alabasi.com',
    position: 'محاسب رئيسي',
    branchId: 1,
    salary: 1000000, // 10000 ريال
    currencyId: 1,
    hireDate: new Date('2023-02-01'),
    isActive: true,
  },
  {
    code: 'EMP003',
    nameAr: 'خالد سعيد',
    nameEn: 'Khaled Saeed',
    phone: '+966503333333',
    email: 'khaled@alabasi.com',
    position: 'موظف مبيعات',
    branchId: 2,
    salary: 600000, // 6000 ريال
    currencyId: 1,
    hireDate: new Date('2023-03-01'),
    isActive: true,
  },
]);
console.log('✅ تم إضافة 3 موظفين\n');

// ============ 10. المخزون ============
console.log('📦 إضافة المخزون...');
const inventory = await db.insert(schema.inventory).values([
  {
    code: 'PROD001',
    nameAr: 'منتج أ',
    nameEn: 'Product A',
    category: 'إلكترونيات',
    branchId: 1,
    quantity: 100,
    unitPrice: 7500, // 75 ريال بالقروش
    currencyId: 1,
    minQuantity: 10,
    isActive: true,
  },
  {
    code: 'PROD002',
    nameAr: 'منتج ب',
    nameEn: 'Product B',
    category: 'أثاث',
    branchId: 1,
    quantity: 200,
    unitPrice: 4500, // 45 ريال
    currencyId: 1,
    minQuantity: 20,
    isActive: true,
  },
  {
    code: 'PROD003',
    nameAr: 'منتج ج',
    nameEn: 'Product C',
    category: 'أدوات',
    branchId: 2,
    quantity: 50,
    unitPrice: 15000, // 150 ريال
    currencyId: 1,
    minQuantity: 5,
    isActive: true,
  },
]);
console.log('✅ تم إضافة 3 منتجات\n');

// ============ 11. القيود اليومية ============
console.log('📖 إضافة القيود اليومية...');

// قيد 1: رأس المال الافتتاحي
const entry1 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-001',
  entryDate: new Date('2025-01-01'),
  description: 'قيد افتتاحي - رأس المال',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry1Id = entry1[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry1Id, accountId: 3, debit: 50000000, credit: 0, description: 'نقدية بالبنك' }, // 500,000 ريال
  { entryId: entry1Id, accountId: 17, debit: 0, credit: 50000000, description: 'رأس المال' },
]);

// قيد 2: مبيعات نقدية
const entry2 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-002',
  entryDate: new Date('2025-01-05'),
  description: 'مبيعات نقدية',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry2Id = entry2[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry2Id, accountId: 2, debit: 1500000, credit: 0, description: 'نقدية بالصندوق' }, // 15,000 ريال
  { entryId: entry2Id, accountId: 20, debit: 0, credit: 1500000, description: 'إيرادات مبيعات' },
]);

// قيد 3: مبيعات آجلة
const entry3 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-003',
  entryDate: new Date('2025-01-07'),
  description: 'مبيعات آجلة - شركة النور',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry3Id = entry3[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry3Id, accountId: 4, debit: 2500000, credit: 0, description: 'عملاء' }, // 25,000 ريال
  { entryId: entry3Id, accountId: 20, debit: 0, credit: 2500000, description: 'إيرادات مبيعات' },
]);

// قيد 4: مبيعات بالبطاقة
const entry4 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-004',
  entryDate: new Date('2025-01-10'),
  description: 'مبيعات بالبطاقة',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry4Id = entry4[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry4Id, accountId: 3, debit: 3200000, credit: 0, description: 'بنك' }, // 32,000 ريال
  { entryId: entry4Id, accountId: 20, debit: 0, credit: 3200000, description: 'إيرادات مبيعات' },
]);

// قيد 5: مشتريات نقدية
const entry5 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-005',
  entryDate: new Date('2025-01-12'),
  description: 'مشتريات بضاعة',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry5Id = entry5[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry5Id, accountId: 5, debit: 1800000, credit: 0, description: 'مخزون' }, // 18,000 ريال
  { entryId: entry5Id, accountId: 2, debit: 0, credit: 1800000, description: 'نقدية' },
]);

// قيد 6: مشتريات آجلة
const entry6 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-006',
  entryDate: new Date('2025-01-15'),
  description: 'مشتريات آجلة',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry6Id = entry6[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry6Id, accountId: 5, debit: 2200000, credit: 0, description: 'مخزون' }, // 22,000 ريال
  { entryId: entry6Id, accountId: 11, debit: 0, credit: 2200000, description: 'موردون' },
]);

// قيد 7: رواتب الشهر
const entry7 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-007',
  entryDate: new Date('2025-01-25'),
  description: 'رواتب يناير 2025',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry7Id = entry7[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry7Id, accountId: 24, debit: 3100000, credit: 0, description: 'مصروفات رواتب' }, // 31,000 ريال
  { entryId: entry7Id, accountId: 3, debit: 0, credit: 3100000, description: 'بنك' },
]);

// قيد 8: رواتب مستحقة
const entry8 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-008',
  entryDate: new Date('2025-01-31'),
  description: 'رواتب مستحقة - يناير',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry8Id = entry8[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry8Id, accountId: 24, debit: 3100000, credit: 0, description: 'مصروفات رواتب' },
  { entryId: entry8Id, accountId: 13, debit: 0, credit: 3100000, description: 'رواتب مستحقة' },
]);

// قيد 9: مصروفات إيجار
const entry9 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-009',
  entryDate: new Date('2025-01-05'),
  description: 'إيجار المكتب - يناير',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry9Id = entry9[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry9Id, accountId: 25, debit: 1200000, credit: 0, description: 'مصروفات إيجار' }, // 12,000 ريال
  { entryId: entry9Id, accountId: 3, debit: 0, credit: 1200000, description: 'بنك' },
]);

// قيد 10: مصروفات متنوعة
const entry10 = await db.insert(schema.journalEntries).values({
  entryNumber: 'JE-2025-010',
  entryDate: new Date('2025-01-20'),
  description: 'مصروفات متنوعة (كهرباء + صيانة)',
  organizationId: 1,
  branchId: 1,
  currencyId: 1,
  createdBy: null,
});
const entry10Id = entry10[0].insertId;
await db.insert(schema.journalEntryLines).values([
  { entryId: entry10Id, accountId: 26, debit: 800000, credit: 0, description: 'كهرباء' }, // 8,000 ريال
  { entryId: entry10Id, accountId: 27, debit: 500000, credit: 0, description: 'صيانة' }, // 5,000 ريال
  { entryId: entry10Id, accountId: 2, debit: 0, credit: 1300000, description: 'نقدية' },
]);

console.log('✅ تم إضافة 10 قيود يومية\n');

// ============ 12. سندات القبض ============
console.log('💵 إضافة سندات القبض...');

const receipts = await db.insert(schema.vouchers).values([
  {
    voucherNumber: 'RV-2025-001',
    voucherDate: new Date('2025-01-08'),
    type: 'receipt',
    amount: 1000000, // 10,000 ريال
    currencyId: 1,
    fromAccount: 'شركة النور التجارية',
    toAccount: 'صندوق الفرع الرئيسي',
    description: 'تحصيل جزئي من عميل',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
  {
    voucherNumber: 'RV-2025-002',
    voucherDate: new Date('2025-01-12'),
    type: 'receipt',
    amount: 1500000, // 15,000 ريال
    currencyId: 1,
    fromAccount: 'مؤسسة الفجر',
    toAccount: 'البنك الأهلي',
    description: 'تحصيل كامل من عميل',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
  {
    voucherNumber: 'RV-2025-003',
    voucherDate: new Date('2025-01-18'),
    type: 'receipt',
    amount: 2500000, // 25,000 ريال
    currencyId: 1,
    fromAccount: 'شركة الأمل',
    toAccount: 'بنك الراجحي',
    description: 'تحصيل فاتورة رقم INV-125',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
  {
    voucherNumber: 'RV-2025-004',
    voucherDate: new Date('2025-01-22'),
    type: 'receipt',
    amount: 800000, // 8,000 ريال
    currencyId: 1,
    fromAccount: 'عميل نقدي',
    toAccount: 'صندوق الفرع الرئيسي',
    description: 'مبيعات نقدية',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
  {
    voucherNumber: 'RV-2025-005',
    voucherDate: new Date('2025-01-28'),
    type: 'receipt',
    amount: 3500000, // 35,000 ريال
    currencyId: 1,
    fromAccount: 'شركة النور التجارية',
    toAccount: 'البنك الأهلي',
    description: 'تسديد باقي الفاتورة',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
]);

console.log('✅ تم إضافة 5 سندات قبض\n');

// ============ 13. سندات الصرف ============
console.log('💸 إضافة سندات الصرف...');

const payments = await db.insert(schema.vouchers).values([
  {
    voucherNumber: 'PV-2025-001',
    voucherDate: new Date('2025-01-10'),
    type: 'payment',
    amount: 1800000, // 18,000 ريال
    currencyId: 1,
    fromAccount: 'صندوق الفرع الرئيسي',
    toAccount: 'مورد البضاعة الأول',
    description: 'سداد مشتريات',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
  {
    voucherNumber: 'PV-2025-002',
    voucherDate: new Date('2025-01-15'),
    type: 'payment',
    amount: 1200000, // 12,000 ريال
    currencyId: 1,
    fromAccount: 'بنك الراجحي',
    toAccount: 'مالك العقار',
    description: 'إيجار المكتب - يناير',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
  {
    voucherNumber: 'PV-2025-003',
    voucherDate: new Date('2025-01-20'),
    type: 'payment',
    amount: 800000, // 8,000 ريال
    currencyId: 1,
    fromAccount: 'صندوق الفرع الرئيسي',
    toAccount: 'شركة الكهرباء',
    description: 'فاتورة كهرباء - يناير',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
  {
    voucherNumber: 'PV-2025-004',
    voucherDate: new Date('2025-01-25'),
    type: 'payment',
    amount: 3100000, // 31,000 ريال
    currencyId: 1,
    fromAccount: 'البنك الأهلي',
    toAccount: 'الموظفين',
    description: 'رواتب يناير 2025',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
  {
    voucherNumber: 'PV-2025-005',
    voucherDate: new Date('2025-01-30'),
    type: 'payment',
    amount: 500000, // 5,000 ريال
    currencyId: 1,
    fromAccount: 'صندوق الفرع الرئيسي',
    toAccount: 'شركة الصيانة',
    description: 'صيانة المعدات',
    organizationId: 1,
    branchId: 1,
    createdBy: null,
  },
]);

console.log('✅ تم إضافة 5 سندات صرف\n');

// ============ الانتهاء ============
await connection.end();

console.log('\n✅ تم إضافة جميع البيانات التجريبية بنجاح!');
console.log('✅ All seed data inserted successfully!\n');

console.log('📊 ملخص البيانات المضافة:');
console.log('📊 Summary of inserted data:');
console.log('   - 3 عملات / Currencies');
console.log('   - 2 فرع / Branches');
console.log('   - 4 وحدات / Units');
console.log('   - 1 مؤسسة / Organization');
console.log('   - 5 تصنيفات حسابات / Account Categories');
console.log('   - 30+ حساب / Accounts');
console.log('   - 5 أنواع حسابات تحليلية / Analytical Account Types');
console.log('   - 9 حسابات تحليلية / Analytical Accounts');
console.log('   - 3 موظفين / Employees');
console.log('   - 3 منتجات / Products');
console.log('   - 10 قيود يومية / Journal Entries');
console.log('   - 5 سندات قبض / Receipt Vouchers');
console.log('   - 5 سندات صرف / Payment Vouchers');
console.log('\n🎉 النظام جاهز للاستخدام!');
console.log('🎉 System is ready to use!\n');
