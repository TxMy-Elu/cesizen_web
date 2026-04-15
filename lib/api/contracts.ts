export type RoleValue = "ROLE_ADMIN" | "ROLE_USER" | string

export type AuthResponse = {
  token: string
  type: string
  userId: number
  email: string
  nom: string
  prenom: string
  role: RoleValue
}

export type UserDto = {
  id: number
  nom: string
  prenom: string
  email: string
  active: boolean
  creationDate: string
  roleId: number
  roleLibelle: RoleValue
}

export type ArticleDto = {
  idArticle: number
  titre: string
  contenu: string
  typeMedia: string
  mediaUrl: string | null
  datePublication: string
  dateModification: string | null
  estPublie: boolean
  idCategorie: number
  categorieLibelle: string
}

export type CategorieDto = {
  idCategorie: number
  libelle: string
  description: string
}

export type ExerciceDto = {
  idExercice: number
  nom: string
  dureeInspiration: number
  dureeApnee: number
  dureeExpiration: number
  description: string
}

export type ExercerDto = {
  idExercer: number
  user: UserDto
  exercice: ExerciceDto
  completedAt: string
}

export type ConsulterDto = {
  idConsulter: number
  idUtilisateur: number
  nomUtilisateur: string
  idArticle: number
  titreArticle: string
  viewedAt: string
}

export type LogConnexionDto = {
  idLogConnexion: number
  dateConnexion: string
  adresseIp: string
  reussite: boolean
  motifEchec: string | null
  emailTente: string
}

export type LogActiviteDto = {
  idLogActivite: number
  dateAction: string
  typeAction: "CREATE" | "UPDATE" | "DELETE" | string
  tableConcernee: string
  idEnregistrement: number
  details: string
  adresseIp: string
  idUtilisateur: number | null
  nomUtilisateur: string | null
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  nom: string
  prenom: string
  email: string
  password: string
}

export type ResetPasswordValidateResponse = {
  valid: boolean
  error?: string
}

export type ResetPasswordRequest = {
  token: string
  newPassword: string
}

export type ArticleCreateDto = {
  titre: string
  contenu: string
  typeMedia: string
  mediaUrl: string | null
  estPublie: boolean
  idCategorie: number
}

export type UserUpdateDto = {
  nom?: string
  prenom?: string
  email?: string
  password?: string
  roleId?: number
}

export type ExercerCreateDto = {
  userId: number
  exerciceId: number
  completedAt?: string
}

export type ConsulterCreateDto = {
  idUtilisateur: number
  idArticle: number
}

