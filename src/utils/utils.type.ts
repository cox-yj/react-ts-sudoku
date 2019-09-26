export interface RandomItem<T = any> {
    (arr: T[]): T
  }

  export interface RandomItems<T = any> {
    (arr: T[], count: number): T[]
  }