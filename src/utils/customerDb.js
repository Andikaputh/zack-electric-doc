// DATABASE DEFAULT PELANGGAN
export const DEFAULT_CUSTOMERS = [
  {
    id: "sdia20",
    name: "SDIA AL-AZHAR 20 Cibubur",
    address: "Jln. H. Abdul Rahman No. 9 Cibubur - Jakarta Timur",
    phone: "02187712666",
    contact: "",
    code: "SDIA20"
  },
  {
    id: "smpia19",
    name: "SMPI AL-AZHAR 19 Cibubur",
    address: "Jln. Jambore Raya No.8 A Cibubur - Jakarta Timur",
    phone: "02187757235",
    contact: "",
    code: "SMPIA19"
  },
  {
    id: "smaia19",
    name: "SMAI AL-AZHAR 19 Ciracas",
    address: "Jln. Raya Centex, Ciracas - Jakarta Timur",
    phone: "021 - 2298.7122, 021 - 2298.7122",
    contact: "Bapak Yudi Susanto",
    code: "SMAIA19"
  }
];

// MENGAMBIL DATA DARI LOCALSTORAGE
export function getCustomerDatabase() {
  const saved = localStorage.getItem('ze_customer_db');
  if (!saved) {
    localStorage.setItem('ze_customer_db', JSON.stringify(DEFAULT_CUSTOMERS));
    return DEFAULT_CUSTOMERS;
  }
  return JSON.parse(saved);
}

// MENYIMPAN DATABASE KE LOCALSTORAGE
export function saveCustomerDatabase(db) {
  localStorage.setItem('ze_customer_db', JSON.stringify(db));
}