export interface IUser {
  _id?: string;
  name?: string;
  email: string;
  password: string;
  role?: string;
  orders?: any[];
  addresses?: any[];
  status?: string;
  createDate?: string;
  modifyDate?: string;
}
