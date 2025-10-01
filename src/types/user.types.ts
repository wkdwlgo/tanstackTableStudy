export interface userDTO {
  get: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    sms_yn: string
    activated: boolean
    lang_key: string
    created_date: string
    reset_date: string
    authorities?: string[] | null
    password: string
  }
}

export interface userAuthorityDTO {
  get: {
    user_id: number
    authority_name: string
  }
}
