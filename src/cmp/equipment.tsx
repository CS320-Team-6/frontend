export interface DateInfo {
  year: number;
  month: number;
  day: number;
}

export interface Equipment {
  id: number;
  name: string;
  equipmentType: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  dateInstalled: DateInfo;
  lastMaintenanceDate: DateInfo;
}