export const tests = {
  "health-checks-essential_tests": [
    {
      routine_tests: [
        {
          id: crypto.randomUUID(),
          testName: "Complete Blood Count (CBC)",
          orgPrice: "308",
          disPrice: "220",
        },
        {
          id: crypto.randomUUID(),
          testName: "Renal Function Test (RFT)",
          orgPrice: "700",
          disPrice: "500",
        },
        {
          id: crypto.randomUUID(),
          testName: "Liver Function Test (LFT)",
          orgPrice: "630",
          disPrice: "450",
        },
        {
          id: crypto.randomUUID(),
          testName: "Serum Electrolytes (S. ELECTROLYTES)",
          orgPrice: "400",
          disPrice: "350",
        },
        {
          id: crypto.randomUUID(),
          testName: "Urine Routine & Micro (URINE ROUTINE & MICRO)",
          orgPrice: "280",
          disPrice: "200",
        },
      ],
      "coagulation-thrombosis": [
        {
          id: crypto.randomUUID(),
          testName: "Prothrombin Time (PT)",
          orgPrice: "210",
          disPrice: "150",
        },
        {
          id: crypto.randomUUID(),
          testName: "Activated Partial Thromboplastin Time (APTT)",
          orgPrice: "210",
          disPrice: "150",
        },
        {
          id: crypto.randomUUID(),
          testName: "Protein S (PS)",
          orgPrice: "560",
          disPrice: "400",
        },
      ],
      "diabetes-metabolic_health": [
        {
          id: crypto.randomUUID(),
          testName: "Glycated Hemoglobin (HbA1c)",
          orgPrice: "532",
          disPrice: "380",
        },
      ],
      "lipid-cardiovascular_risk": [
        {
          id: crypto.randomUUID(),
          testName: "Lipid Profile (LIPID PROFILE)",
          orgPrice: "798",
          disPrice: "570",
        },
        {
          id: crypto.randomUUID(),
          testName: "Homocysteine (HOMOCYSTEINE)",
          orgPrice: "770",
          disPrice: "550",
        },
        {
          id: crypto.randomUUID(),
          testName: "High Sensitivity CRP (hs-CRP)",
          orgPrice: "770",
          disPrice: "550",
        },
      ],
      "microbiology-culture": [
        {
          id: crypto.randomUUID(),
          testName: "Culture/Sensitivity Urine (C/S URINE)",
          orgPrice: "630",
          disPrice: "450",
        },
        {
          id: crypto.randomUUID(),
          testName: "Culture/Sensitivity Blood (C/S BLOOD)",
          orgPrice: "700",
          disPrice: "980",
        },
        {
          id: crypto.randomUUID(),
          testName: "Culture/Sensitivity Sputum (C/S SPUTUM)",
          orgPrice: "850",
          disPrice: "1190",
        },
        {
          id: crypto.randomUUID(),
          testName: "Sputum Acid Fast Bacilli (SPUTUM AFB)",
          orgPrice: "280",
          disPrice: "200",
        },
      ],
    },
  ],

  "hormones, thyroid-tumor_markers": [
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Thyroid Stimulating Hormone (TSH)",
          orgPrice: "280",
          disPrice: "200",
        },
        {
          id: crypto.randomUUID(),
          testName: "Free Triiodothyronine (FT3)",
          orgPrice: "378",
          disPrice: "270",
        },
        {
          id: crypto.randomUUID(),
          testName: "Free Thyroxine (FT4)",
          orgPrice: "378",
          disPrice: "270",
        },
        {
          id: crypto.randomUUID(),
          testName: "Free Thyroid Function Test (Free TFT)",
          orgPrice: "490",
          disPrice: "350",
        },
        {
          id: crypto.randomUUID(),
          testName: "Thyroid Function Test (TFT)",
          orgPrice: "448",
          disPrice: "320",
        },
      ],
    },
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Anti Thyroid Peroxidase Antibody (Anti-TPO)",
          orgPrice: "980",
          disPrice: "700",
        },
        {
          id: crypto.randomUUID(),
          testName: "Follicle Stimulating Hormone (FSH)",
          orgPrice: "560",
          disPrice: "400",
        },
        {
          id: crypto.randomUUID(),
          testName: "Luteinizing Hormone (LH)",
          orgPrice: "490",
          disPrice: "350",
        },
        {
          id: crypto.randomUUID(),
          testName: "Prolactin Hormone (Prolactin)",
          orgPrice: "560",
          disPrice: "400",
        },
        {
          id: crypto.randomUUID(),
          testName: "Estradiol (E2) (Estradiol)",
          orgPrice: "840",
          disPrice: "600",
        },
      ],
    },
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Progesterone Hormone (Progesterone)",
          orgPrice: "630",
          disPrice: "450",
        },
        {
          id: crypto.randomUUID(),
          testName: "Total Testosterone (Testosterone)",
          orgPrice: "518",
          disPrice: "370",
        },
        {
          id: crypto.randomUUID(),
          testName: "Free Testosterone (Free Testosterone)",
          orgPrice: "910",
          disPrice: "650",
        },
        {
          id: crypto.randomUUID(),
          testName: "Beta Human Chorionic Gonadotropin (Beta HCG)",
          orgPrice: "1050",
          disPrice: "750",
        },
        {
          id: crypto.randomUUID(),
          testName: "Anti Mullerian Hormone (AMH)",
          orgPrice: "2380",
          disPrice: "1700",
        },
      ],
    },
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Prostate Specific Antigen (PSA)",
          orgPrice: "980",
          disPrice: "700",
        },
        {
          id: crypto.randomUUID(),
          testName: "Insulin Fasting / Random (Insulin F/R)",
          orgPrice: "840",
          disPrice: "600",
        },
        {
          id: crypto.randomUUID(),
          testName: "Cortisol Total (Cortisol Total)",
          orgPrice: "910",
          disPrice: "650",
        },
        {
          id: crypto.randomUUID(),
          testName: "25-OH Vitamin D Total (Vitamin D)",
          orgPrice: "1190",
          disPrice: "850",
        },
        {
          id: crypto.randomUUID(),
          testName: "Vitamin B12 (Vitamin B12)",
          orgPrice: "770",
          disPrice: "550",
        },
      ],
    },
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Cancer Antigen 125 (CA-125)",
          orgPrice: "1120",
          disPrice: "800",
        },
        {
          id: crypto.randomUUID(),
          testName: "Carcinoembryonic Antigen (CEA)",
          orgPrice: "1120",
          disPrice: "800",
        },
      ],
    },
  ],

  "advanced-specialized_tests": [
    {
      "infection-fever_profile": [
        {
          id: crypto.randomUUID(),
          testName: "Dengue Profile",
          orgPrice: "1680",
          disPrice: "1200",
        },
        {
          id: crypto.randomUUID(),
          testName: "Chikungunya IgM",
          orgPrice: "938",
          disPrice: "670",
        },
        {
          id: crypto.randomUUID(),
          testName: "Chikungunya(IgM & IgG Antibodies)",
          orgPrice: "1260",
          disPrice: "900",
        },
        {
          id: crypto.randomUUID(),
          testName: "Typhidot IgG",
          orgPrice: "1120",
          disPrice: "800",
        },
        {
          id: crypto.randomUUID(),
          testName: "Anti HCV",
          orgPrice: "1302",
          disPrice: "930",
        },
      ],
    },
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Rubella IgM (Rubella IgM)",
          orgPrice: "840",
          disPrice: "600",
        },
        {
          id: crypto.randomUUID(),
          testName: "Rubella IgG (Rubella IgG)",
          orgPrice: "700",
          disPrice: "500",
        },
      ],
    },
    {
      inflammation_rheumatology: [
        {
          id: crypto.randomUUID(),
          testName: "C-Reactive Protein (CRP)",
          orgPrice: "630",
          disPrice: "450",
        },
        {
          id: crypto.randomUUID(),
          testName: "hs-CRP",
          orgPrice: "770",
          disPrice: "550",
        },
        {
          id: crypto.randomUUID(),
          testName: "Anti Streptolysin O Titre (ASO Titre)",
          orgPrice: "518",
          disPrice: "370",
        },
        {
          id: crypto.randomUUID(),
          testName: "Rheumatoid Arthritis Factor (RA Factor)",
          orgPrice: "560",
          disPrice: "400",
        },
        {
          id: crypto.randomUUID(),
          testName: "Anti CCP",
          orgPrice: "1330",
          disPrice: "950",
        },
      ],
    },
    {
      "autoimmune-disorders": [
        {
          id: crypto.randomUUID(),
          testName: "Antinuclear Antibody",
          orgPrice: "840",
          disPrice: "600",
        },
        {
          id: crypto.randomUUID(),
          testName: "Indirect Immunofluorescence",
          orgPrice: "910",
          disPrice: "650",
        },
        {
          id: crypto.randomUUID(),
          testName: "Extended ANA Panel",
          orgPrice: "6720",
          disPrice: "4800",
        },
      ],
    },
    {
      "cardiac-markers": [
        {
          id: crypto.randomUUID(),
          testName: "Cardiac Troponin T",
          orgPrice: "1330",
          disPrice: "950",
        },
        {
          id: crypto.randomUUID(),
          testName: "Lactate Dehydrogenase",
          orgPrice: "770",
          disPrice: "550",
        },
      ],
    },
    {
      "nutrition_deficiency-profile": [
        {
          id: crypto.randomUUID(),
          testName: "Iron Storage Protein (Ferritin)",
          orgPrice: "700",
          disPrice: "500",
        },
        {
          id: crypto.randomUUID(),
          testName: "Serum Iron",
          orgPrice: "630",
          disPrice: "450",
        },
        {
          id: crypto.randomUUID(),
          testName: "Serum Calcium",
          orgPrice: "420",
          disPrice: "300",
        },
      ],
    },
    {
      "pancreatic-function": [
        {
          id: crypto.randomUUID(),
          testName: "Pancreatic Enzyme (Amylase)",
          orgPrice: "630",
          disPrice: "450",
        },
        {
          id: crypto.randomUUID(),
          testName: "Pancreatic Enzyme (Lipase)",
          orgPrice: "658",
          disPrice: "470",
        },
      ],
    },
    {
      "kidney-health": [
        {
          id: crypto.randomUUID(),
          testName: "Renal Function Test (RFT)",
          orgPrice: "700",
          disPrice: "500",
        },
        {
          id: crypto.randomUUID(),
          testName: "Urea (Urea)",
          orgPrice: "350",
          disPrice: "250",
        },
        {
          id: crypto.randomUUID(),
          testName: "Creatinine (Creatinine)",
          orgPrice: "350",
          disPrice: "250",
        },
        {
          id: crypto.randomUUID(),
          testName: "Uric Acid (Uric Acid)",
          orgPrice: "378",
          disPrice: "270",
        },
        {
          id: crypto.randomUUID(),
          testName: "Urine Microalbumin",
          orgPrice: "0",
          disPrice: "0",
        },
      ],
    },
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Na, K, Cl, HCO₃ Panel",
          orgPrice: "840",
          disPrice: "640",
        },
      ],
    },
    {
      "allergy-profile": [
        {
          id: crypto.randomUUID(),
          testName: "Immunoglobulin E",
          orgPrice: "910",
          disPrice: "650",
        },
      ],
    },
    {
      "specialized-proteins": [
        {
          id: crypto.randomUUID(),
          testName:
            "Serum Protein Electrophoresis (Serum Protein Electrophoresis)",
          orgPrice: "1680",
          disPrice: "1200",
        },
      ],
    },
  ],

  "pregnancy_womens-health-tests": [
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Prenatal Screen I",
          orgPrice: "2380",
          disPrice: "1700",
        },
        {
          id: crypto.randomUUID(),
          testName: "Prenatal Screen II",
          orgPrice: "2380",
          disPrice: "1700",
        },
        {
          id: crypto.randomUUID(),
          testName: "Prenatal Screen (NIPT)",
          orgPrice: "4900",
          disPrice: "3500",
        },
        {
          id: crypto.randomUUID(),
          testName: "Beta HCG",
          orgPrice: "1050",
          disPrice: "750",
        },
        {
          id: crypto.randomUUID(),
          testName: "AMH",
          orgPrice: "2380",
          disPrice: "1700",
        },
      ],
    },
    {
      unknown_sub_category: [
        {
          id: crypto.randomUUID(),
          testName: "Progesterone",
          orgPrice: "630",
          disPrice: "450",
        },
        {
          id: crypto.randomUUID(),
          testName: "Estradiol",
          orgPrice: "840",
          disPrice: "600",
        },
        {
          id: crypto.randomUUID(),
          testName: "FSH",
          orgPrice: "560",
          disPrice: "400",
        },
        {
          id: crypto.randomUUID(),
          testName: "LH",
          orgPrice: "490",
          disPrice: "350",
        },
      ],
    },
  ],
}

export type TestItem = {
  id: string
  testName: string
  orgPrice: string
  disPrice: string
}

export type PrimaryCategory = keyof typeof tests

// extract the subcategory keys from the first element of each primary category
// type SubCategoryGroupType = {
//   [key in keyof typeof data]: keyof (typeof data)[key]
// }
type SubCategoryGroup = {
  // [key in keyof typeof tests]: {
  // [key: string]: TestItem[]
  // [key in keyof (typeof tests)[key][number]]: TestItem[]
  // }
  // [key in PrimaryCategory]: {
  //   [key in keyof (typeof tests)[number]]: TestItem[]
  // }
  // [key in PrimaryCategory]: {
  //   [subCategoryGroupKey: string]: TestItem[]
  // }[]
}

const buildTestIndex = () => {
  const index = new Map<string, TestItem>() // exact lookup
  const allTests: TestItem[] = [] // for partial
  ;(Object.keys(tests) as Array<PrimaryCategory>).forEach((primaryKey) => {
    const subCategoryGroups = tests[primaryKey]

    for (const subCategoryGroup of subCategoryGroups) {
      for (const subCategoryKey of Object.keys(subCategoryGroup)) {
        const grp = subCategoryGroup as unknown as Record<string, TestItem[]>
        const arr = grp[subCategoryKey] as unknown as TestItem[]
        for (const test of arr) {
          allTests.push(test)
          index.set(test.testName.toLowerCase(), test)
        }
      }
    }
  })

  return { index, allTests }
}

const { index: exactIndex, allTests } = buildTestIndex()

export function searchTestByName(testName: string): TestItem | null {
  const q = testName.trim().toLowerCase()
  if (!q) return null

  // exact match first
  const exact = exactIndex.get(q)
  if (exact) return exact

  // partial match (q appears anywhere in testName)
  const hit = allTests.find((t) => t.testName.toLowerCase().includes(q))
  return hit ?? null
}

// type PrimaryCategory = keyof typeof tests

// const buildTestIndex = () => {
//   const index = new Map<string, TestItem>()

//   // Walk through:
//   // tests[primaryCategory] -> array of subCategory objects
//   // each subCategory object -> keys -> array of TestItem
//   ;(Object.keys(tests) as Array<PrimaryCategory>).forEach((primaryKey) => {
//     const subCategoryGroups = tests[primaryKey]

//     for (const subCategoryGroup of subCategoryGroups) {
//       for (const subCategoryKey of Object.keys(subCategoryGroup)) {
//         const arr = subCategoryGroup[subCategoryKey] as unknown as TestItem[]
//         for (const test of arr) {
//           index.set(test.testName.toLowerCase(), test)
//         }
//       }
//     }
//   })

//   return index
// }

// const testIndex = buildTestIndex()

// export function searchTestByName(testName: string): TestItem | null {
//   const key = testName.trim().toLowerCase()
//   return testIndex.get(key) ?? null
// }
