

export interface iContainer {
  sr?:number,
  id?:number,
  cont_no?: string,
  location?: string,
  User: object,
  created_at?: Date,
  isDeleting?: boolean
}
export interface iUser {
  full_name?: string
}

export interface iColumn {
  field: string,
  header: string,
  customExportHeader?: string,
  visible:boolean,
  action?:boolean

}

export interface iExportColumn {
  title: string,
  datakey: string
}