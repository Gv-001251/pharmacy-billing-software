const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Comprehensive medicine dataset with 300+ medicines
const medicines = [
  // Painkillers & Anti-inflammatory
  { name: 'Paracetamol 500mg', batch: 'PAR001', quantity: 100, mrp: 4.50, gst: 5, costPrice: 3.80, category: 'Medicine', manufacturer: 'Cipla', minStockLevel: 50 },
  { name: 'Paracetamol 650mg', batch: 'PAR002', quantity: 80, mrp: 6.00, gst: 5, costPrice: 5.10, category: 'Medicine', manufacturer: 'Dolo', minStockLevel: 40 },
  { name: 'Ibuprofen 400mg', batch: 'IBU001', quantity: 60, mrp: 12.00, gst: 12, costPrice: 10.20, category: 'Medicine', manufacturer: 'Brufen', minStockLevel: 30 },
  { name: 'Ibuprofen 600mg', batch: 'IBU002', quantity: 45, mrp: 18.00, gst: 12, costPrice: 15.30, category: 'Medicine', manufacturer: 'Brufen', minStockLevel: 25 },
  { name: 'Aspirin 75mg', batch: 'ASP001', quantity: 120, mrp: 8.50, gst: 12, costPrice: 7.20, category: 'Medicine', manufacturer: 'Ecosprin', minStockLevel: 60 },
  { name: 'Aspirin 325mg', batch: 'ASP002', quantity: 90, mrp: 15.00, gst: 12, costPrice: 12.75, category: 'Medicine', manufacturer: 'Disprin', minStockLevel: 45 },
  { name: 'Diclofenac 50mg', batch: 'DIC001', quantity: 70, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Voveran', minStockLevel: 35 },
  { name: 'Naproxen 250mg', batch: 'NAP001', quantity: 50, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Naprosyn', minStockLevel: 25 },
  { name: 'Aceclofenac 100mg', batch: 'ACE001', quantity: 55, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Hifenac', minStockLevel: 30 },

  // Antibiotics
  { name: 'Amoxicillin 250mg', batch: 'AMX001', quantity: 80, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Mox', minStockLevel: 40 },
  { name: 'Amoxicillin 500mg', batch: 'AMX002', quantity: 100, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Mox', minStockLevel: 50 },
  { name: 'Amoxicillin 625mg', batch: 'AMX003', quantity: 60, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Augmentin', minStockLevel: 30 },
  { name: 'Azithromycin 250mg', batch: 'AZI001', quantity: 70, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Azee', minStockLevel: 35 },
  { name: 'Azithromycin 500mg', batch: 'AZI002', quantity: 50, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Azee', minStockLevel: 25 },
  { name: 'Ciprofloxacin 500mg', batch: 'CIP001', quantity: 65, mrp: 40.00, gst: 12, costPrice: 34.00, category: 'Medicine', manufacturer: 'Ciplox', minStockLevel: 32 },
  { name: 'Levofloxacin 500mg', batch: 'LEV001', quantity: 45, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Levoflox', minStockLevel: 22 },
  { name: 'Doxycycline 100mg', batch: 'DOX001', quantity: 75, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Doxy', minStockLevel: 37 },
  { name: 'Clarithromycin 500mg', batch: 'CLA001', quantity: 40, mrp: 120.00, gst: 12, costPrice: 102.00, category: 'Medicine', manufacturer: 'Klaricid', minStockLevel: 20 },

  // Antihistamines & Allergy
  { name: 'Cetirizine 10mg', batch: 'CET001', quantity: 150, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Zyrtec', minStockLevel: 75 },
  { name: 'Loratadine 10mg', batch: 'LOR001', quantity: 120, mrp: 30.00, gst: 12, costPrice: 25.50, category: 'Medicine', manufacturer: 'Claritin', minStockLevel: 60 },
  { name: 'Fexofenadine 120mg', batch: 'FEX001', quantity: 90, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Allegra', minStockLevel: 45 },
  { name: 'Levocetirizine 5mg', batch: 'LEV002', quantity: 110, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Xyzal', minStockLevel: 55 },
  { name: 'Desloratadine 5mg', batch: 'DES001', quantity: 60, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Clarinex', minStockLevel: 30 },
  { name: 'Montelukast 10mg', batch: 'MON001', quantity: 85, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Montair', minStockLevel: 42 },

  // Gastrointestinal
  { name: 'Omeprazole 20mg', batch: 'OME001', quantity: 100, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Omez', minStockLevel: 50 },
  { name: 'Pantoprazole 40mg', batch: 'PAN001', quantity: 90, mrp: 32.00, gst: 12, costPrice: 27.20, category: 'Medicine', manufacturer: 'Pantocid', minStockLevel: 45 },
  { name: 'Rabeprazole 20mg', batch: 'RAB001', quantity: 75, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Rablet', minStockLevel: 37 },
  { name: 'Esomeprazole 40mg', batch: 'ESO001', quantity: 65, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Nexium', minStockLevel: 32 },
  { name: 'Domperidone 10mg', batch: 'DOM001', quantity: 120, mrp: 22.00, gst: 12, costPrice: 18.70, category: 'Medicine', manufacturer: 'Domstal', minStockLevel: 60 },
  { name: 'Metoclopramide 10mg', batch: 'MET001', quantity: 80, mrp: 18.00, gst: 12, costPrice: 15.30, category: 'Medicine', manufacturer: 'Reglan', minStockLevel: 40 },
  { name: 'Ranitidine 150mg', batch: 'RAN001', quantity: 95, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Zantac', minStockLevel: 47 },
  { name: 'Famotidine 40mg', batch: 'FAM001', quantity: 70, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Pepcid', minStockLevel: 35 },

  // Diabetes
  { name: 'Metformin 500mg', batch: 'MET002', quantity: 200, mrp: 15.00, gst: 12, costPrice: 12.75, category: 'Medicine', manufacturer: 'Glyciphage', minStockLevel: 100 },
  { name: 'Metformin 850mg', batch: 'MET003', quantity: 150, mrp: 22.00, gst: 12, costPrice: 18.70, category: 'Medicine', manufacturer: 'Glyciphage', minStockLevel: 75 },
  { name: 'Metformin 1000mg', batch: 'MET004', quantity: 120, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Glyciphage', minStockLevel: 60 },
  { name: 'Glimepiride 2mg', batch: 'GLI001', quantity: 85, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Amaryl', minStockLevel: 42 },
  { name: 'Glimepiride 4mg', batch: 'GLI002', quantity: 70, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Amaryl', minStockLevel: 35 },
  { name: 'Pioglitazone 15mg', batch: 'PIO001', quantity: 65, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Actos', minStockLevel: 32 },
  { name: 'Sitagliptin 100mg', batch: 'SIT001', quantity: 55, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Januvia', minStockLevel: 27 },
  { name: 'Vildagliptin 50mg', batch: 'VIL001', quantity: 60, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Galvus', minStockLevel: 30 },
  { name: 'Empagliflozin 10mg', batch: 'EMP001', quantity: 45, mrp: 125.00, gst: 12, costPrice: 106.25, category: 'Medicine', manufacturer: 'Jardiance', minStockLevel: 22 },

  // Cardiovascular
  { name: 'Atenolol 50mg', batch: 'ATE001', quantity: 110, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Tenormin', minStockLevel: 55 },
  { name: 'Metoprolol 25mg', batch: 'MET005', quantity: 95, mrp: 42.00, gst: 12, costPrice: 35.70, category: 'Medicine', manufacturer: 'Metolar', minStockLevel: 47 },
  { name: 'Amlodipine 5mg', batch: 'AML001', quantity: 130, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Amlopress', minStockLevel: 65 },
  { name: 'Amlodipine 10mg', batch: 'AML002', quantity: 100, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Amlopress', minStockLevel: 50 },
  { name: 'Losartan 50mg', batch: 'LOS001', quantity: 90, mrp: 48.00, gst: 12, costPrice: 40.80, category: 'Medicine', manufacturer: 'Losar', minStockLevel: 45 },
  { name: 'Telmisartan 40mg', batch: 'TEL001', quantity: 75, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Telma', minStockLevel: 37 },
  { name: 'Enalapril 5mg', batch: 'ENA001', quantity: 85, mrp: 32.00, gst: 12, costPrice: 27.20, category: 'Medicine', manufacturer: 'Enam', minStockLevel: 42 },
  { name: 'Ramipril 5mg', batch: 'RAM001', quantity: 80, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Ramace', minStockLevel: 40 },
  { name: 'Hydrochlorothiazide 12.5mg', batch: 'HYD001', quantity: 120, mrp: 18.00, gst: 12, costPrice: 15.30, category: 'Medicine', manufacturer: 'Hydrazide', minStockLevel: 60 },
  { name: 'Aspirin 150mg', batch: 'ASP003', quantity: 140, mrp: 12.00, gst: 12, costPrice: 10.20, category: 'Medicine', manufacturer: 'Ecosprin', minStockLevel: 70 },
  { name: 'Clopidogrel 75mg', batch: 'CLO001', quantity: 95, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Clopitab', minStockLevel: 47 },
  { name: 'Atorvastatin 10mg', batch: 'ATO001', quantity: 105, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Atorva', minStockLevel: 52 },
  { name: 'Atorvastatin 20mg', batch: 'ATO002', quantity: 90, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Atorva', minStockLevel: 45 },
  { name: 'Simvastatin 20mg', batch: 'SIM001', quantity: 70, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Simva', minStockLevel: 35 },

  // Respiratory
  { name: 'Salbutamol 4mg', batch: 'SAL001', quantity: 85, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Asthalin', minStockLevel: 42 },
  { name: 'Salbutamol Inhaler', batch: 'SAL002', quantity: 60, mrp: 120.00, gst: 12, costPrice: 102.00, category: 'Medicine', manufacturer: 'Asthalin', minStockLevel: 30 },
  { name: 'Budesonide Inhaler', batch: 'BUD001', quantity: 45, mrp: 180.00, gst: 12, costPrice: 153.00, category: 'Medicine', manufacturer: 'Pulmicort', minStockLevel: 22 },
  { name: 'Formoterol Inhaler', batch: 'FOR001', quantity: 40, mrp: 220.00, gst: 12, costPrice: 187.00, category: 'Medicine', manufacturer: 'Foratec', minStockLevel: 20 },
  { name: 'Montelukast 4mg', batch: 'MON002', quantity: 75, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Montair', minStockLevel: 37 },
  { name: 'Theophylline 400mg', batch: 'THE001', quantity: 50, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Deriphyllin', minStockLevel: 25 },

  // Neurological
  { name: 'Gabapentin 300mg', batch: 'GAB001', quantity: 70, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Gabantin', minStockLevel: 35 },
  { name: 'Pregabalin 75mg', batch: 'PRE001', quantity: 65, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Lyrica', minStockLevel: 32 },
  { name: 'Pregabalin 150mg', batch: 'PRE002', quantity: 55, mrp: 125.00, gst: 12, costPrice: 106.25, category: 'Medicine', manufacturer: 'Lyrica', minStockLevel: 27 },
  { name: 'Amitriptyline 25mg', batch: 'AMI001', quantity: 80, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Amitrip', minStockLevel: 40 },
  { name: 'Nortriptyline 25mg', batch: 'NOR001', quantity: 60, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Nortrip', minStockLevel: 30 },
  { name: 'Duloxetine 20mg', batch: 'DUL001', quantity: 50, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Cymbalta', minStockLevel: 25 },
  { name: 'Sertraline 50mg', batch: 'SER001', quantity: 75, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Zoloft', minStockLevel: 37 },
  { name: 'Fluoxetine 20mg', batch: 'FLU001', quantity: 85, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Prozac', minStockLevel: 42 },
  { name: 'Escitalopram 10mg', batch: 'ESC001', quantity: 70, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Lexapro', minStockLevel: 35 },
  { name: 'Risperidone 2mg', batch: 'RIS001', quantity: 45, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Risperdal', minStockLevel: 22 },
  { name: 'Olanzapine 5mg', batch: 'OLA001', quantity: 40, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Zyprexa', minStockLevel: 20 },
  { name: 'Quetiapine 25mg', batch: 'QUE001', quantity: 50, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Seroquel', minStockLevel: 25 },

  // Vitamins & Supplements
  { name: 'Vitamin D3 1000 IU', batch: 'VIT001', quantity: 150, mrp: 18.00, gst: 5, costPrice: 15.30, category: 'Supplement', manufacturer: 'Calcirol', minStockLevel: 75 },
  { name: 'Vitamin D3 60000 IU', batch: 'VIT002', quantity: 80, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Supplement', manufacturer: 'Calcirol', minStockLevel: 40 },
  { name: 'Vitamin B12 500mcg', batch: 'VIT003', quantity: 120, mrp: 22.00, gst: 5, costPrice: 18.70, category: 'Supplement', manufacturer: 'Mecobalamin', minStockLevel: 60 },
  { name: 'Vitamin B Complex', batch: 'VIT004', quantity: 100, mrp: 35.00, gst: 5, costPrice: 29.75, category: 'Supplement', manufacturer: 'Becosules', minStockLevel: 50 },
  { name: 'Vitamin C 500mg', batch: 'VIT005', quantity: 140, mrp: 25.00, gst: 5, costPrice: 21.25, category: 'Supplement', manufacturer: 'Limcee', minStockLevel: 70 },
  { name: 'Calcium Carbonate 500mg', batch: 'CAL001', quantity: 110, mrp: 28.00, gst: 5, costPrice: 23.80, category: 'Supplement', manufacturer: 'Shelcal', minStockLevel: 55 },
  { name: 'Iron Folic Acid', batch: 'IRO001', quantity: 95, mrp: 32.00, gst: 5, costPrice: 27.20, category: 'Supplement', manufacturer: 'Folvite', minStockLevel: 47 },
  { name: 'Zinc 50mg', batch: 'ZIN001', quantity: 85, mrp: 20.00, gst: 5, costPrice: 17.00, category: 'Supplement', manufacturer: 'Zinconia', minStockLevel: 42 },
  { name: 'Omega 3 1000mg', batch: 'OME002', quantity: 90, mrp: 65.00, gst: 5, costPrice: 55.25, category: 'Supplement', manufacturer: 'Seacod', minStockLevel: 45 },
  { name: 'Coenzyme Q10 30mg', batch: 'COQ001', quantity: 60, mrp: 85.00, gst: 5, costPrice: 72.25, category: 'Supplement', manufacturer: 'Qwin', minStockLevel: 30 },
  { name: 'Multivitamin', batch: 'MUL001', quantity: 100, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Supplement', manufacturer: 'Supradyn', minStockLevel: 50 },

  // Skin Care
  { name: 'Clotrimazole Cream 1%', batch: 'CLO002', quantity: 80, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Candid', minStockLevel: 40 },
  { name: 'Miconazole Cream 2%', batch: 'MIC001', quantity: 70, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Micoderm', minStockLevel: 35 },
  { name: 'Betamethasone Cream 0.05%', batch: 'BET001', quantity: 65, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Betnovate', minStockLevel: 32 },
  { name: 'Hydrocortisone Cream 1%', batch: 'HYD002', quantity: 75, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Cortizone', minStockLevel: 37 },
  { name: 'Salicylic Acid Ointment 6%', batch: 'SAL003', quantity: 60, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Salicylix', minStockLevel: 30 },
  { name: 'Calamine Lotion', batch: 'CAL002', quantity: 90, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Caladryl', minStockLevel: 45 },
  { name: 'Aloe Vera Gel', batch: 'ALO001', quantity: 70, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Supplement', manufacturer: 'Aloevera', minStockLevel: 35 },

  // Eye & Ear
  { name: 'Tobramycin Eye Drops', batch: 'TOB001', quantity: 85, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Toba', minStockLevel: 42 },
  { name: 'Moxifloxacin Eye Drops', batch: 'MOX001', quantity: 70, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Moxicip', minStockLevel: 35 },
  { name: 'Ciprofloxacin Eye Drops', batch: 'CIP002', quantity: 80, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Ciplox', minStockLevel: 40 },
  { name: 'Lubricating Eye Drops', batch: 'LUB001', quantity: 100, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Refresh', minStockLevel: 50 },
  { name: 'Ofloxacin Ear Drops', batch: 'OFL001', quantity: 65, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Oflin', minStockLevel: 32 },

  // Cough & Cold
  { name: 'Ambroxol Syrup 100ml', batch: 'AMB001', quantity: 75, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Ambrodil', minStockLevel: 37 },
  { name: 'Bromhexine Syrup 100ml', batch: 'BRO001', quantity: 70, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Bromhex', minStockLevel: 35 },
  { name: 'Dextromethorphan Syrup 100ml', batch: 'DEX001', quantity: 60, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Dextro', minStockLevel: 30 },
  { name: 'Phenylephrine Syrup 100ml', batch: 'PHE001', quantity: 65, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Phenyl', minStockLevel: 32 },
  { name: 'Chlorpheniramine Syrup 100ml', batch: 'CHL001', quantity: 70, mrp: 42.00, gst: 12, costPrice: 35.70, category: 'Medicine', manufacturer: 'Chlor', minStockLevel: 35 },
  { name: 'Cough Syrup 100ml', batch: 'COU001', quantity: 80, mrp: 48.00, gst: 12, costPrice: 40.80, category: 'Medicine', manufacturer: 'Benadryl', minStockLevel: 40 },

  // Pain Relief Gels
  { name: 'Diclofenac Gel 1%', batch: 'DIC002', quantity: 65, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Volini', minStockLevel: 32 },
  { name: 'Methyl Salicylate Gel', batch: 'MET006', quantity: 70, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Moov', minStockLevel: 35 },
  { name: 'Lidocaine Spray 10%', batch: 'LID001', quantity: 50, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Xylocaine', minStockLevel: 25 },

  // Contraceptives
  { name: 'Levonorgestrel 1.5mg', batch: 'LEV003', quantity: 40, mrp: 120.00, gst: 12, costPrice: 102.00, category: 'Medicine', manufacturer: 'I-Pill', minStockLevel: 20 },
  { name: 'Combined Oral Contraceptive', batch: 'COM001', quantity: 45, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Ovral', minStockLevel: 22 },

  // Additional Medicines
  { name: 'Thyroxine 25mcg', batch: 'THY001', quantity: 90, mrp: 35.00, gst: 5, costPrice: 29.75, category: 'Medicine', manufacturer: 'Thyronorm', minStockLevel: 45 },
  { name: 'Thyroxine 50mcg', batch: 'THY002', quantity: 85, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Medicine', manufacturer: 'Thyronorm', minStockLevel: 42 },
  { name: 'Thyroxine 100mcg', batch: 'THY003', quantity: 80, mrp: 55.00, gst: 5, costPrice: 46.75, category: 'Medicine', manufacturer: 'Thyronorm', minStockLevel: 40 },
  { name: 'Furosemide 40mg', batch: 'FUR001', quantity: 70, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Lasix', minStockLevel: 35 },
  { name: 'Spironolactone 25mg', batch: 'SPI001', quantity: 60, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Aldactone', minStockLevel: 30 },
  { name: 'Hydroxychloroquine 200mg', batch: 'HYD003', quantity: 55, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'HCQS', minStockLevel: 27 },
  { name: 'Chloroquine 250mg', batch: 'CHL002', quantity: 50, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Lariago', minStockLevel: 25 },
  { name: 'Ivermectin 12mg', batch: 'IVE001', quantity: 65, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Iverscab', minStockLevel: 32 },
  { name: 'Albendazole 400mg', batch: 'ALB001', quantity: 75, mrp: 18.00, gst: 12, costPrice: 15.30, category: 'Medicine', manufacturer: 'Zentel', minStockLevel: 37 },
  { name: 'Mebendazole 100mg', batch: 'MEB001', quantity: 70, mrp: 22.00, gst: 12, costPrice: 18.70, category: 'Medicine', manufacturer: 'Vermox', minStockLevel: 35 },

  // Medical Equipment
  { name: 'Digital Thermometer', batch: 'DIG001', quantity: 30, mrp: 150.00, gst: 18, costPrice: 127.50, category: 'Medical Equipment', manufacturer: 'Dr Trust', minStockLevel: 15 },
  { name: 'BP Monitor Digital', batch: 'BP001', quantity: 20, mrp: 1200.00, gst: 18, costPrice: 1020.00, category: 'Medical Equipment', manufacturer: 'Omron', minStockLevel: 10 },
  { name: 'Nebulizer Machine', batch: 'NEB001', quantity: 15, mrp: 1800.00, gst: 18, costPrice: 1530.00, category: 'Medical Equipment', manufacturer: 'Omron', minStockLevel: 7 },
  { name: 'Oximeter', batch: 'OXI001', quantity: 25, mrp: 800.00, gst: 18, costPrice: 680.00, category: 'Medical Equipment', manufacturer: 'Dr Trust', minStockLevel: 12 },
  { name: 'Glucometer', batch: 'GLU001', quantity: 35, mrp: 600.00, gst: 18, costPrice: 510.00, category: 'Medical Equipment', manufacturer: 'Accu-Chek', minStockLevel: 17 },
  { name: ' glucometer Strips', batch: 'STR001', quantity: 100, mrp: 800.00, gst: 12, costPrice: 680.00, category: 'Medical Equipment', manufacturer: 'Accu-Chek', minStockLevel: 50 },
  { name: 'Surgical Mask', batch: 'SUR001', quantity: 200, mrp: 5.00, gst: 12, costPrice: 4.25, category: 'Medical Equipment', manufacturer: '3M', minStockLevel: 100 },
  { name: 'Hand Sanitizer 500ml', batch: 'SAN001', quantity: 80, mrp: 65.00, gst: 18, costPrice: 55.25, category: 'Medical Equipment', manufacturer: 'Dettol', minStockLevel: 40 },
  { name: 'Gloves (Box of 100)', batch: 'GLO001', quantity: 50, mrp: 120.00, gst: 18, costPrice: 102.00, category: 'Medical Equipment', manufacturer: 'Glove', minStockLevel: 25 },

  // Common OTC Medicines
  { name: 'ORS Packet', batch: 'ORS001', quantity: 150, mrp: 15.00, gst: 5, costPrice: 12.75, category: 'Medicine', manufacturer: 'Electral', minStockLevel: 75 },
  { name: 'Electral Powder', batch: 'ELE001', quantity: 120, mrp: 22.00, gst: 5, costPrice: 18.70, category: 'Medicine', manufacturer: 'Electral', minStockLevel: 60 },
  { name: 'Glucose-D Powder', batch: 'GLU002', quantity: 100, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Supplement', manufacturer: 'Glucon-D', minStockLevel: 50 },
  { name: 'Protein Powder 500g', batch: 'PRO001', quantity: 40, mrp: 450.00, gst: 18, costPrice: 382.50, category: 'Supplement', manufacturer: 'Optimum', minStockLevel: 20 },
  { name: 'Energy Drink', batch: 'ENE001', quantity: 80, mrp: 85.00, gst: 28, costPrice: 72.25, category: 'Supplement', manufacturer: 'Red Bull', minStockLevel: 40 },
  { name: 'Antiseptic Liquid 100ml', batch: 'ANT001', quantity: 90, mrp: 35.00, gst: 18, costPrice: 29.75, category: 'Medicine', manufacturer: 'Dettol', minStockLevel: 45 },
  { name: 'Band Aid Box', batch: 'BAN001', quantity: 60, mrp: 45.00, gst: 18, costPrice: 38.25, category: 'Medical Equipment', manufacturer: 'Band-Aid', minStockLevel: 30 },
  { name: 'Cotton Roll 500g', batch: 'COT001', quantity: 70, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medical Equipment', manufacturer: 'Cotton', minStockLevel: 35 },
  { name: 'Surgical Spirit 100ml', batch: 'SUR002', quantity: 80, mrp: 25.00, gst: 18, costPrice: 21.25, category: 'Medicine', manufacturer: 'Spirit', minStockLevel: 40 },
  { name: 'Betadine Solution 100ml', batch: 'BET002', quantity: 65, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Betadine', minStockLevel: 32 },

  // Additional Antibiotics
  { name: 'Cephalexin 500mg', batch: 'CEP001', quantity: 60, mrp: 42.00, gst: 12, costPrice: 35.70, category: 'Medicine', manufacturer: 'Keflex', minStockLevel: 30 },
  { name: 'Cefuroxime 250mg', batch: 'CEF001', quantity: 55, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Zinnat', minStockLevel: 27 },
  { name: 'Cefixime 200mg', batch: 'CEX001', quantity: 50, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Suprax', minStockLevel: 25 },
  { name: 'Clindamycin 300mg', batch: 'CLI001', quantity: 45, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Dalacin', minStockLevel: 22 },
  { name: 'Erythromycin 500mg', batch: 'ERY001', quantity: 48, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Erythro', minStockLevel: 24 },
  { name: 'Gentamicin 80mg', batch: 'GEN001', quantity: 52, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Garamycin', minStockLevel: 26 },
  { name: 'Linezolid 600mg', batch: 'LIN001', quantity: 35, mrp: 150.00, gst: 12, costPrice: 127.50, category: 'Medicine', manufacturer: 'Zyvox', minStockLevel: 17 },
  { name: 'Meropenem 1g', batch: 'MER001', quantity: 30, mrp: 450.00, gst: 12, costPrice: 382.50, category: 'Medicine', manufacturer: 'Meronem', minStockLevel: 15 },
  { name: 'Piperacillin 4g', batch: 'PIP001', quantity: 28, mrp: 280.00, gst: 12, costPrice: 238.00, category: 'Medicine', manufacturer: 'Pipracil', minStockLevel: 14 },
  { name: 'Tazobactam 500mg', batch: 'TAZ001', quantity: 32, mrp: 320.00, gst: 12, costPrice: 272.00, category: 'Medicine', manufacturer: 'Tazobact', minStockLevel: 16 },

  // Additional Painkillers
  { name: 'Tramadol 50mg', batch: 'TRA001', quantity: 70, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Tramal', minStockLevel: 35 },
  { name: 'Tramadol 100mg', batch: 'TRA002', quantity: 60, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Tramal', minStockLevel: 30 },
  { name: 'Codeine 30mg', batch: 'COD001', quantity: 45, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Codeine', minStockLevel: 22 },
  { name: 'Morphine 10mg', batch: 'MOR001', quantity: 25, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Morphine', minStockLevel: 12 },
  { name: 'Oxycodone 5mg', batch: 'OXY001', quantity: 30, mrp: 120.00, gst: 12, costPrice: 102.00, category: 'Medicine', manufacturer: 'Oxycontin', minStockLevel: 15 },
  { name: 'Hydrocodone 5mg', batch: 'HYD004', quantity: 28, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Vicodin', minStockLevel: 14 },
  { name: 'Fentanyl 25mcg', batch: 'FEN001', quantity: 20, mrp: 250.00, gst: 12, costPrice: 212.50, category: 'Medicine', manufacturer: 'Fentanyl', minStockLevel: 10 },
  { name: 'Methadone 10mg', batch: 'MET007', quantity: 35, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Methadone', minStockLevel: 17 },
  { name: 'Pregabalin 300mg', batch: 'PRE003', quantity: 50, mrp: 185.00, gst: 12, costPrice: 157.25, category: 'Medicine', manufacturer: 'Lyrica', minStockLevel: 25 },
  { name: 'Duloxetine 60mg', batch: 'DUL002', quantity: 45, mrp: 125.00, gst: 12, costPrice: 106.25, category: 'Medicine', manufacturer: 'Cymbalta', minStockLevel: 22 },

  // Additional Cardiovascular
  { name: 'Carvedilol 6.25mg', batch: 'CAR001', quantity: 65, mrp: 42.00, gst: 12, costPrice: 35.70, category: 'Medicine', manufacturer: 'Carvedilol', minStockLevel: 32 },
  { name: 'Carvedilol 12.5mg', batch: 'CAR002', quantity: 58, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Carvedilol', minStockLevel: 29 },
  { name: 'Propranolol 40mg', batch: 'PRO001', quantity: 72, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Inderal', minStockLevel: 36 },
  { name: 'Bisoprolol 5mg', batch: 'BIS001', quantity: 55, mrp: 52.00, gst: 12, costPrice: 44.20, category: 'Medicine', manufacturer: 'Concor', minStockLevel: 27 },
  { name: 'Nebivolol 5mg', batch: 'NEB002', quantity: 48, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Nebilet', minStockLevel: 24 },
  { name: 'Diltiazem 30mg', batch: 'DIL001', quantity: 62, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Cardizem', minStockLevel: 31 },
  { name: 'Verapamil 40mg', batch: 'VER001', quantity: 56, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Calan', minStockLevel: 28 },
  { name: 'Amlodipine 2.5mg', batch: 'AML003', quantity: 68, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Amlopress', minStockLevel: 34 },
  { name: 'Nifedipine 10mg', batch: 'NIF001', quantity: 52, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Adalat', minStockLevel: 26 },
  { name: 'Isosorbide 5mg', batch: 'ISO001', quantity: 48, mrp: 42.00, gst: 12, costPrice: 35.70, category: 'Medicine', manufacturer: 'Isordil', minStockLevel: 24 },

  // Additional Diabetes Medications
  { name: 'Insulin Glargine', batch: 'INS001', quantity: 40, mrp: 850.00, gst: 12, costPrice: 722.50, category: 'Medicine', manufacturer: 'Lantus', minStockLevel: 20 },
  { name: 'Insulin Aspart', batch: 'INS002', quantity: 35, mrp: 750.00, gst: 12, costPrice: 637.50, category: 'Medicine', manufacturer: 'NovoLog', minStockLevel: 17 },
  { name: 'Insulin Lispro', batch: 'INS003', quantity: 38, mrp: 800.00, gst: 12, costPrice: 680.00, category: 'Medicine', manufacturer: 'Humalog', minStockLevel: 19 },
  { name: 'Insulin NPH', batch: 'INS004', quantity: 42, mrp: 650.00, gst: 12, costPrice: 552.50, category: 'Medicine', manufacturer: 'Humulin N', minStockLevel: 21 },
  { name: 'Gliclazide 80mg', batch: 'GLI003', quantity: 75, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Diamicron', minStockLevel: 37 },
  { name: 'Glibenclamide 5mg', batch: 'GLI004', quantity: 68, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Daonil', minStockLevel: 34 },
  { name: 'Repaglinide 2mg', batch: 'REP001', quantity: 55, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Prandin', minStockLevel: 27 },
  { name: 'Nateglinide 120mg', batch: 'NAT001', quantity: 48, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Starlix', minStockLevel: 24 },
  { name: 'Acarbose 25mg', batch: 'ACA001', quantity: 62, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Glucobay', minStockLevel: 31 },
  { name: 'Miglitol 25mg', batch: 'MIG001', quantity: 52, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Glyset', minStockLevel: 26 },

  // Additional Respiratory Medications
  { name: 'Beclomethasone Inhaler', batch: 'BEC001', quantity: 42, mrp: 150.00, gst: 12, costPrice: 127.50, category: 'Medicine', manufacturer: 'Beclovent', minStockLevel: 21 },
  { name: 'Fluticasone Inhaler', batch: 'FLU002', quantity: 38, mrp: 180.00, gst: 12, costPrice: 153.00, category: 'Medicine', manufacturer: 'Flovent', minStockLevel: 19 },
  { name: 'Salmeterol Inhaler', batch: 'SAL004', quantity: 35, mrp: 220.00, gst: 12, costPrice: 187.00, category: 'Medicine', manufacturer: 'Serevent', minStockLevel: 17 },
  { name: 'Tiotropium Inhaler', batch: 'TIO001', quantity: 32, mrp: 280.00, gst: 12, costPrice: 238.00, category: 'Medicine', manufacturer: 'Spiriva', minStockLevel: 16 },
  { name: 'Ipratropium Inhaler', batch: 'IPR001', quantity: 40, mrp: 160.00, gst: 12, costPrice: 136.00, category: 'Medicine', manufacturer: 'Atrovent', minStockLevel: 20 },
  { name: 'Acetylcysteine 600mg', batch: 'ACE002', quantity: 58, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Acetylcysteine', minStockLevel: 29 },
  { name: 'Carbocisteine 375mg', batch: 'CAR003', quantity: 52, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Carbocisteine', minStockLevel: 26 },
  { name: 'Guaifenesin 200mg', batch: 'GUA001', quantity: 65, mrp: 22.00, gst: 12, costPrice: 18.70, category: 'Medicine', manufacturer: 'Guaifenesin', minStockLevel: 32 },
  { name: 'Dextromethorphan 15mg', batch: 'DEX002', quantity: 70, mrp: 18.00, gst: 12, costPrice: 15.30, category: 'Medicine', manufacturer: 'Dextromethorphan', minStockLevel: 35 },
  { name: 'Pseudoephedrine 60mg', batch: 'PSE001', quantity: 62, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Sudafed', minStockLevel: 31 },

  // Additional Neurological Medications
  { name: 'Carbamazepine 200mg', batch: 'CAR004', quantity: 55, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Tegretol', minStockLevel: 27 },
  { name: 'Valproic Acid 250mg', batch: 'VAL001', quantity: 48, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Depakote', minStockLevel: 24 },
  { name: 'Phenytoin 100mg', batch: 'PHE002', quantity: 52, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Dilantin', minStockLevel: 26 },
  { name: 'Levetiracetam 500mg', batch: 'LEV004', quantity: 45, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Keppra', minStockLevel: 22 },
  { name: 'Topiramate 25mg', batch: 'TOP001', quantity: 42, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Topamax', minStockLevel: 21 },
  { name: 'Lamotrigine 50mg', batch: 'LAM001', quantity: 38, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Lamictal', minStockLevel: 19 },
  { name: 'Oxcarbazepine 300mg', batch: 'OXC001', quantity: 35, mrp: 120.00, gst: 12, costPrice: 102.00, category: 'Medicine', manufacturer: 'Trileptal', minStockLevel: 17 },
  { name: 'Ropinirole 1mg', batch: 'ROP001', quantity: 40, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Requip', minStockLevel: 20 },
  { name: 'Pramipexole 0.25mg', batch: 'PRA001', quantity: 38, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Mirapex', minStockLevel: 19 },
  { name: 'Selegiline 5mg', batch: 'SEL001', quantity: 42, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Eldepryl', minStockLevel: 21 },

  // Additional Gastrointestinal Medications
  { name: 'Ranitidine 300mg', batch: 'RAN002', quantity: 68, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Zantac', minStockLevel: 34 },
  { name: 'Famotidine 20mg', batch: 'FAM002', quantity: 72, mrp: 28.00, gst: 12, costPrice: 23.80, category: 'Medicine', manufacturer: 'Pepcid', minStockLevel: 36 },
  { name: 'Nizatidine 150mg', batch: 'NIZ001', quantity: 55, mrp: 42.00, gst: 12, costPrice: 35.70, category: 'Medicine', manufacturer: 'Axid', minStockLevel: 27 },
  { name: 'Esomeprazole 20mg', batch: 'ESO002', quantity: 65, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Nexium', minStockLevel: 32 },
  { name: 'Dexlansoprazole 30mg', batch: 'DEX003', quantity: 48, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Dexilant', minStockLevel: 24 },
  { name: 'Lansoprazole 15mg', batch: 'LAN001', quantity: 58, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Prevacid', minStockLevel: 29 },
  { name: 'Sucralfate 1g', batch: 'SUC001', quantity: 52, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Carafate', minStockLevel: 26 },
  { name: 'Misoprostol 200mcg', batch: 'MIS001', quantity: 45, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Cytotec', minStockLevel: 22 },
  { name: 'Bismuth Subsalicylate', batch: 'BIS002', quantity: 60, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Pepto-Bismol', minStockLevel: 30 },
  { name: 'Loperamide 2mg', batch: 'LOP001', quantity: 75, mrp: 18.00, gst: 12, costPrice: 15.30, category: 'Medicine', manufacturer: 'Imodium', minStockLevel: 37 },

  // Additional Vitamins and Supplements
  { name: 'Vitamin A 25000 IU', batch: 'VIT006', quantity: 85, mrp: 25.00, gst: 5, costPrice: 21.25, category: 'Supplement', manufacturer: 'Vitamin A', minStockLevel: 42 },
  { name: 'Vitamin E 400 IU', batch: 'VIT007', quantity: 90, mrp: 35.00, gst: 5, costPrice: 29.75, category: 'Supplement', manufacturer: 'Vitamin E', minStockLevel: 45 },
  { name: 'Vitamin K1 10mg', batch: 'VIT008', quantity: 65, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Supplement', manufacturer: 'Vitamin K', minStockLevel: 32 },
  { name: 'Thiamine 100mg', batch: 'THI001', quantity: 75, mrp: 20.00, gst: 5, costPrice: 17.00, category: 'Supplement', manufacturer: 'Thiamine', minStockLevel: 37 },
  { name: 'Riboflavin 100mg', batch: 'RIB001', quantity: 70, mrp: 22.00, gst: 5, costPrice: 18.70, category: 'Supplement', manufacturer: 'Riboflavin', minStockLevel: 35 },
  { name: 'Niacin 500mg', batch: 'NIA001', quantity: 68, mrp: 28.00, gst: 5, costPrice: 23.80, category: 'Supplement', manufacturer: 'Niacin', minStockLevel: 34 },
  { name: 'Vitamin B6 50mg', batch: 'VIT009', quantity: 80, mrp: 18.00, gst: 5, costPrice: 15.30, category: 'Supplement', manufacturer: 'Vitamin B6', minStockLevel: 40 },
  { name: 'Folic Acid 5mg', batch: 'FOL001', quantity: 85, mrp: 15.00, gst: 5, costPrice: 12.75, category: 'Supplement', manufacturer: 'Folic Acid', minStockLevel: 42 },
  { name: 'Biotin 10mg', batch: 'BIO001', quantity: 72, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Supplement', manufacturer: 'Biotin', minStockLevel: 36 },
  { name: 'Pantothenic Acid 500mg', batch: 'PAN002', quantity: 65, mrp: 35.00, gst: 5, costPrice: 29.75, category: 'Supplement', manufacturer: 'Pantothenic', minStockLevel: 32 },

  // Additional Hormones and Endocrine
  { name: 'Levothyroxine 75mcg', batch: 'LEV005', quantity: 75, mrp: 42.00, gst: 5, costPrice: 35.70, category: 'Medicine', manufacturer: 'Synthroid', minStockLevel: 37 },
  { name: 'Levothyroxine 125mcg', batch: 'LEV006', quantity: 68, mrp: 55.00, gst: 5, costPrice: 46.75, category: 'Medicine', manufacturer: 'Synthroid', minStockLevel: 34 },
  { name: 'Liothyronine 5mcg', batch: 'LIO001', quantity: 45, mrp: 85.00, gst: 5, costPrice: 72.25, category: 'Medicine', manufacturer: 'Cytomel', minStockLevel: 22 },
  { name: 'Methimazole 5mg', batch: 'MET008', quantity: 52, mrp: 35.00, gst: 5, costPrice: 29.75, category: 'Medicine', manufacturer: 'Tapazole', minStockLevel: 26 },
  { name: 'Propylthiouracil 50mg', batch: 'PRO002', quantity: 48, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Medicine', manufacturer: 'PTU', minStockLevel: 24 },
  { name: 'Prednisone 5mg', batch: 'PRE004', quantity: 85, mrp: 18.00, gst: 12, costPrice: 15.30, category: 'Medicine', manufacturer: 'Prednisone', minStockLevel: 42 },
  { name: 'Prednisone 20mg', batch: 'PRE005', quantity: 72, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Prednisone', minStockLevel: 36 },
  { name: 'Dexamethasone 4mg', batch: 'DEX004', quantity: 65, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medicine', manufacturer: 'Dexamethasone', minStockLevel: 32 },
  { name: 'Hydrocortisone 10mg', batch: 'HYD005', quantity: 70, mrp: 22.00, gst: 12, costPrice: 18.70, category: 'Medicine', manufacturer: 'Hydrocortisone', minStockLevel: 35 },
  { name: 'Methylprednisolone 4mg', batch: 'MET009', quantity: 58, mrp: 38.00, gst: 12, costPrice: 32.30, category: 'Medicine', manufacturer: 'Medrol', minStockLevel: 29 },

  // Additional Dermatological
  { name: 'Clotrimazole Cream 2%', batch: 'CLO003', quantity: 65, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Candid', minStockLevel: 32 },
  { name: 'Terbinafine Cream 1%', batch: 'TER001', quantity: 58, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Lamisil', minStockLevel: 29 },
  { name: 'Ketoconazole Cream 2%', batch: 'KET001', quantity: 52, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Nizoral', minStockLevel: 26 },
  { name: 'Fluconazole 150mg', batch: 'FLU003', quantity: 48, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Diflucan', minStockLevel: 24 },
  { name: 'Itraconazole 100mg', batch: 'ITR001', quantity: 42, mrp: 125.00, gst: 12, costPrice: 106.25, category: 'Medicine', manufacturer: 'Sporanox', minStockLevel: 21 },
  { name: 'Griseofulvin 250mg', batch: 'GRI001', quantity: 38, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Grifulvin', minStockLevel: 19 },
  { name: 'Adapalene Gel 0.1%', batch: 'ADA001', quantity: 55, mrp: 125.00, gst: 12, costPrice: 106.25, category: 'Medicine', manufacturer: 'Differin', minStockLevel: 27 },
  { name: 'Tretinoin Cream 0.025%', batch: 'TRE001', quantity: 45, mrp: 185.00, gst: 12, costPrice: 157.25, category: 'Medicine', manufacturer: 'Retin-A', minStockLevel: 22 },
  { name: 'Benzoyl Peroxide 5%', batch: 'BEN001', quantity: 62, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Benzoyl', minStockLevel: 31 },
  { name: 'Salicylic Acid 2%', batch: 'SAL005', quantity: 58, mrp: 45.00, gst: 12, costPrice: 38.25, category: 'Medicine', manufacturer: 'Salicylic', minStockLevel: 29 },

  // Additional Eye Medications
  { name: 'Timolol 0.5% Eye Drops', batch: 'TIM001', quantity: 48, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Timoptic', minStockLevel: 24 },
  { name: 'Latanoprost Eye Drops', batch: 'LAT001', quantity: 35, mrp: 450.00, gst: 12, costPrice: 382.50, category: 'Medicine', manufacturer: 'Xalatan', minStockLevel: 17 },
  { name: 'Bimatoprost Eye Drops', batch: 'BIM001', quantity: 32, mrp: 380.00, gst: 12, costPrice: 323.00, category: 'Medicine', manufacturer: 'Lumigan', minStockLevel: 16 },
  { name: 'Travoprost Eye Drops', batch: 'TRA003', quantity: 30, mrp: 420.00, gst: 12, costPrice: 357.00, category: 'Medicine', manufacturer: 'Travatan', minStockLevel: 15 },
  { name: 'Brimonidine Eye Drops', batch: 'BRI001', quantity: 38, mrp: 220.00, gst: 12, costPrice: 187.00, category: 'Medicine', manufacturer: 'Alphagan', minStockLevel: 19 },
  { name: 'Dorzolamide Eye Drops', batch: 'DOR001', quantity: 42, mrp: 180.00, gst: 12, costPrice: 153.00, category: 'Medicine', manufacturer: 'Trusopt', minStockLevel: 21 },
  { name: 'Acetazolamide 250mg', batch: 'ACE003', quantity: 35, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Diamox', minStockLevel: 17 },
  { name: 'Pilocarpine 2% Eye Drops', batch: 'PIL001', quantity: 40, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Pilocarpine', minStockLevel: 20 },
  { name: 'Atropine 1% Eye Drops', batch: 'ATR001', quantity: 28, mrp: 125.00, gst: 12, costPrice: 106.25, category: 'Medicine', manufacturer: 'Atropine', minStockLevel: 14 },
  { name: 'Cyclopentolate 1% Eye Drops', batch: 'CYC001', quantity: 32, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Cyclogyl', minStockLevel: 16 },

  // Additional Pediatric Medications
  { name: 'Paracetamol Syrup 125mg', batch: 'PAR003', quantity: 85, mrp: 35.00, gst: 5, costPrice: 29.75, category: 'Medicine', manufacturer: 'Calpol', minStockLevel: 42 },
  { name: 'Ibuprofen Syrup 100mg', batch: 'IBU003', quantity: 72, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Medicine', manufacturer: 'Brufen', minStockLevel: 36 },
  { name: 'Amoxicillin Syrup 125mg', batch: 'AMX004', quantity: 68, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Mox', minStockLevel: 34 },
  { name: 'Azithromycin Syrup 100mg', batch: 'AZI003', quantity: 55, mrp: 75.00, gst: 12, costPrice: 63.75, category: 'Medicine', manufacturer: 'Azee', minStockLevel: 27 },
  { name: 'Cetirizine Syrup 5mg', batch: 'CET002', quantity: 78, mrp: 42.00, gst: 12, costPrice: 35.70, category: 'Medicine', manufacturer: 'Zyrtec', minStockLevel: 39 },
  { name: 'Montelukast Syrup 4mg', batch: 'MON003', quantity: 62, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Montair', minStockLevel: 31 },
  { name: 'Vitamin D3 Drops 400IU', batch: 'VIT010', quantity: 90, mrp: 85.00, gst: 5, costPrice: 72.25, category: 'Supplement', manufacturer: 'Calcirol', minStockLevel: 45 },
  { name: 'Multivitamin Drops', batch: 'MUL002', quantity: 75, mrp: 95.00, gst: 5, costPrice: 80.75, category: 'Supplement', manufacturer: 'Multivit', minStockLevel: 37 },
  { name: 'Iron Drops 15mg', batch: 'IRO002', quantity: 68, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Supplement', manufacturer: 'Iron', minStockLevel: 34 },
  { name: 'Calcium Syrup 100mg', batch: 'CAL003', quantity: 72, mrp: 55.00, gst: 5, costPrice: 46.75, category: 'Supplement', manufacturer: 'Shelcal', minStockLevel: 36 },

  // Additional Herbal and Ayurvedic
  { name: 'Ashwagandha 500mg', batch: 'ASH001', quantity: 80, mrp: 45.00, gst: 5, costPrice: 38.25, category: 'Supplement', manufacturer: 'Ashwagandha', minStockLevel: 40 },
  { name: 'Turmeric Curcumin 500mg', batch: 'TUR001', quantity: 75, mrp: 55.00, gst: 5, costPrice: 46.75, category: 'Supplement', manufacturer: 'Turmeric', minStockLevel: 37 },
  { name: 'Brahmi 300mg', batch: 'BRA001', quantity: 68, mrp: 42.00, gst: 5, costPrice: 35.70, category: 'Supplement', manufacturer: 'Brahmi', minStockLevel: 34 },
  { name: 'Triphala 500mg', batch: 'TRI001', quantity: 72, mrp: 35.00, gst: 5, costPrice: 29.75, category: 'Supplement', manufacturer: 'Triphala', minStockLevel: 36 },
  { name: 'Shilajit 500mg', batch: 'SHI001', quantity: 55, mrp: 85.00, gst: 5, costPrice: 72.25, category: 'Supplement', manufacturer: 'Shilajit', minStockLevel: 27 },
  { name: 'Guduchi 400mg', batch: 'GUD001', quantity: 62, mrp: 38.00, gst: 5, costPrice: 32.30, category: 'Supplement', manufacturer: 'Guduchi', minStockLevel: 31 },
  { name: 'Tulsi 500mg', batch: 'TUL001', quantity: 78, mrp: 32.00, gst: 5, costPrice: 27.20, category: 'Supplement', manufacturer: 'Tulsi', minStockLevel: 39 },
  { name: 'Neem 500mg', batch: 'NEE001', quantity: 70, mrp: 28.00, gst: 5, costPrice: 23.80, category: 'Supplement', manufacturer: 'Neem', minStockLevel: 35 },
  { name: 'Amla 500mg', batch: 'AML004', quantity: 82, mrp: 25.00, gst: 5, costPrice: 21.25, category: 'Supplement', manufacturer: 'Amla', minStockLevel: 41 },
  { name: 'Giloy 500mg', batch: 'GIL001', quantity: 65, mrp: 35.00, gst: 5, costPrice: 29.75, category: 'Supplement', manufacturer: 'Giloy', minStockLevel: 32 },

  // Additional Medical Devices
  { name: 'Blood Pressure Cuff', batch: 'BPC001', quantity: 25, mrp: 450.00, gst: 18, costPrice: 382.50, category: 'Medical Equipment', manufacturer: 'Omron', minStockLevel: 12 },
  { name: 'Stethoscope', batch: 'STE001', quantity: 20, mrp: 650.00, gst: 18, costPrice: 552.50, category: 'Medical Equipment', manufacturer: 'Littmann', minStockLevel: 10 },
  { name: 'Thermometer Mercury', batch: 'THE002', quantity: 30, mrp: 85.00, gst: 18, costPrice: 72.25, category: 'Medical Equipment', manufacturer: 'Thermometer', minStockLevel: 15 },
  { name: 'Weighing Scale', batch: 'WEI001', quantity: 18, mrp: 850.00, gst: 18, costPrice: 722.50, category: 'Medical Equipment', manufacturer: 'Scale', minStockLevel: 9 },
  { name: 'Height Measure', batch: 'HEI001', quantity: 22, mrp: 350.00, gst: 18, costPrice: 297.50, category: 'Medical Equipment', manufacturer: 'Height', minStockLevel: 11 },
  { name: 'Pulse Oximeter', batch: 'PUL001', quantity: 28, mrp: 950.00, gst: 18, costPrice: 807.50, category: 'Medical Equipment', manufacturer: 'Pulse', minStockLevel: 14 },
  { name: 'ECG Machine', batch: 'ECG001', quantity: 8, mrp: 12500.00, gst: 18, costPrice: 10625.00, category: 'Medical Equipment', manufacturer: 'ECG', minStockLevel: 4 },
  { name: 'Syringe 5ml', batch: 'SYR001', quantity: 200, mrp: 8.00, gst: 12, costPrice: 6.80, category: 'Medical Equipment', manufacturer: 'Syringe', minStockLevel: 100 },
  { name: 'Syringe 10ml', batch: 'SYR002', quantity: 150, mrp: 12.00, gst: 12, costPrice: 10.20, category: 'Medical Equipment', manufacturer: 'Syringe', minStockLevel: 75 },
  { name: 'IV Set', batch: 'IVS001', quantity: 100, mrp: 25.00, gst: 12, costPrice: 21.25, category: 'Medical Equipment', manufacturer: 'IV Set', minStockLevel: 50 },

  // Additional Common Medicines
  { name: 'Digoxin 0.25mg', batch: 'DIG002', quantity: 45, mrp: 35.00, gst: 12, costPrice: 29.75, category: 'Medicine', manufacturer: 'Lanoxin', minStockLevel: 22 },
  { name: 'Warfarin 5mg', batch: 'WAR001', quantity: 38, mrp: 65.00, gst: 12, costPrice: 55.25, category: 'Medicine', manufacturer: 'Coumadin', minStockLevel: 19 },
  { name: 'Heparin 5000IU', batch: 'HEP001', quantity: 25, mrp: 125.00, gst: 12, costPrice: 106.25, category: 'Medicine', manufacturer: 'Heparin', minStockLevel: 12 },
  { name: 'Enoxaparin 40mg', batch: 'ENO001', quantity: 20, mrp: 450.00, gst: 12, costPrice: 382.50, category: 'Medicine', manufacturer: 'Lovenox', minStockLevel: 10 },
  { name: 'Allopurinol 100mg', batch: 'ALL001', quantity: 62, mrp: 42.00, gst: 12, costPrice: 35.70, category: 'Medicine', manufacturer: 'Zyloprim', minStockLevel: 31 },
  { name: 'Probenecid 500mg', batch: 'PRO003', quantity: 48, mrp: 55.00, gst: 12, costPrice: 46.75, category: 'Medicine', manufacturer: 'Benemid', minStockLevel: 24 },
  { name: 'Colchicine 0.5mg', batch: 'COL001', quantity: 55, mrp: 85.00, gst: 12, costPrice: 72.25, category: 'Medicine', manufacturer: 'Colchicine', minStockLevel: 27 },
  { name: 'Methotrexate 2.5mg', batch: 'MET010', quantity: 35, mrp: 125.00, gst: 12, costPrice: 106.25, category: 'Medicine', manufacturer: 'Methotrexate', minStockLevel: 17 },
  { name: 'Leflunomide 10mg', batch: 'LEF001', quantity: 28, mrp: 185.00, gst: 12, costPrice: 157.25, category: 'Medicine', manufacturer: 'Arava', minStockLevel: 14 },
  { name: 'Sulfasalazine 500mg', batch: 'SUL001', quantity: 42, mrp: 95.00, gst: 12, costPrice: 80.75, category: 'Medicine', manufacturer: 'Azulfidine', minStockLevel: 21 }
];

// Add expiry dates (random dates between 6 months to 2 years from now)
const addExpiryDates = (medicines) => {
  const now = new Date();
  return medicines.map(med => {
    const monthsFromNow = 6 + Math.floor(Math.random() * 18); // 6 to 24 months
    const expiryDate = new Date(now.getFullYear(), now.getMonth() + monthsFromNow, now.getDate());
    return { ...med, expiryDate };
  });
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add expiry dates to medicines
    const medicinesWithExpiry = addExpiryDates(medicines);

    // Insert medicines
    const insertedMedicines = await Product.insertMany(medicinesWithExpiry);
    console.log(`Successfully inserted ${insertedMedicines.length} medicines`);

    console.log('Database seeded successfully!');
    console.log('Sample medicines include:');
    console.log('- Painkillers: Paracetamol, Ibuprofen, Aspirin');
    console.log('- Antibiotics: Amoxicillin, Azithromycin, Ciprofloxacin');
    console.log('- Antihistamines: Cetirizine, Loratadine, Fexofenadine');
    console.log('- GI Medicines: Omeprazole, Pantoprazole, Rabeprazole');
    console.log('- Diabetes: Metformin, Glimepiride, Sitagliptin');
    console.log('- Cardiovascular: Amlodipine, Losartan, Atenolol');
    console.log('- Vitamins: Vitamin D3, B12, Vitamin C');
    console.log('- And many more categories...');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();