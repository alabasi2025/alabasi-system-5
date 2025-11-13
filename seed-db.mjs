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
console.log('\n🎉 النظام جاهز للاستخدام!');
console.log('🎉 System is ready to use!\n');
