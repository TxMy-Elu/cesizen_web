import { apiRequest } from "@/lib/api/http-client"
import type {
  ArticleCreateDto,
  ArticleDto,
  AuthResponse,
  CategorieDto,
  ConsulterCreateDto,
  ConsulterDto,
  ExercerCreateDto,
  ExercerDto,
  ExerciceDto,
  LogActiviteDto,
  LogConnexionDto,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordValidateResponse,
  UserDto,
  UserUpdateDto,
} from "@/lib/api/contracts"

export const authApi = {
  login: (payload: LoginRequest) =>
    apiRequest<AuthResponse>("/api/auth/login", { method: "POST", body: payload }),
  register: (payload: RegisterRequest) =>
    apiRequest<AuthResponse>("/api/auth/register", { method: "POST", body: payload }),
  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),
  validateResetToken: (token: string) =>
    apiRequest<ResetPasswordValidateResponse>(`/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`),
  resetPassword: (payload: ResetPasswordRequest) =>
    apiRequest<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: payload,
    }),
}

export const articleApi = {
  list: () => apiRequest<ArticleDto[]>("/api/article/list"),
  listPublic: () => apiRequest<ArticleDto[]>("/api/article/public"),
  getById: (id: number) => apiRequest<ArticleDto>(`/api/article/${id}`),
  create: (payload: ArticleCreateDto, token: string) =>
    apiRequest<ArticleDto>("/api/article", { method: "POST", body: payload, token }),
  update: (id: number, payload: ArticleCreateDto, token: string) =>
    apiRequest<ArticleDto>(`/api/article/${id}`, { method: "PUT", body: payload, token }),
  remove: (id: number, token: string) =>
    apiRequest<void>(`/api/article/${id}`, { method: "DELETE", token }),
  upload: async (file: File, token: string) => {
    const formData = new FormData()
    formData.append("file", file)
    return apiRequest<{ url: string; filename: string }>("/api/article/upload", {
      method: "POST",
      body: formData,
      token,
      isFormData: true,
    })
  },
}

export const categorieApi = {
  list: () => apiRequest<CategorieDto[]>("/api/categorie/list"),
  getById: (id: number) => apiRequest<CategorieDto>(`/api/categorie/${id}`),
  create: (payload: { libelle: string; description: string }, token: string) =>
    apiRequest<CategorieDto>("/api/categorie", { method: "POST", body: payload, token }),
  update: (id: number, payload: { libelle: string; description: string }, token: string) =>
    apiRequest<CategorieDto>(`/api/categorie/${id}`, { method: "PUT", body: payload, token }),
  remove: (id: number, token: string) => apiRequest<void>(`/api/categorie/${id}`, { method: "DELETE", token }),
}

export const exerciceApi = {
  list: () => apiRequest<ExerciceDto[]>("/api/exercice/list"),
  getById: (id: number) => apiRequest<ExerciceDto>(`/api/exercice/${id}`),
  create: (
    payload: {
      nom: string
      dureeInspiration: number
      dureeApnee: number
      dureeExpiration: number
      description: string
    },
    token: string
  ) => apiRequest<ExerciceDto>("/api/exercice", { method: "POST", body: payload, token }),
  update: (
    id: number,
    payload: {
      nom: string
      dureeInspiration: number
      dureeApnee: number
      dureeExpiration: number
      description: string
    },
    token: string
  ) => apiRequest<ExerciceDto>(`/api/exercice/${id}`, { method: "PUT", body: payload, token }),
  remove: (id: number, token: string) => apiRequest<void>(`/api/exercice/${id}`, { method: "DELETE", token }),
}

export const userApi = {
  list: (token: string) => apiRequest<UserDto[]>("/api/user/list", { token }),
  getById: (id: number, token: string) => apiRequest<UserDto>(`/api/user/${id}`, { token }),
  update: (id: number, payload: UserUpdateDto, token: string) =>
    apiRequest<UserDto>(`/api/user/${id}`, { method: "PUT", body: payload, token }),
  remove: (id: number, token: string) => apiRequest<void>(`/api/user/${id}`, { method: "DELETE", token }),
}

export const roleApi = {
  list: (token: string) => apiRequest<Array<{ id: number; libelle: string }>>("/api/role/list", { token }),
}

export const exercerApi = {
  list: (token: string) => apiRequest<ExercerDto[]>("/api/exercer/list", { token }),
  listPublic: (token: string) => apiRequest<ExercerDto[]>("/api/exercer/public", { token }),
  byUser: (userId: number, token: string) =>
    apiRequest<ExercerDto[]>(`/api/exercer/user/${userId}`, { token }),
  byExercice: (exerciceId: number, token: string) =>
    apiRequest<ExercerDto[]>(`/api/exercer/exercice/${exerciceId}`, { token }),
  getById: (id: number, token: string) => apiRequest<ExercerDto>(`/api/exercer/${id}`, { token }),
  create: (payload: ExercerCreateDto, token: string) =>
    apiRequest<ExercerDto>("/api/exercer", { method: "POST", body: payload, token }),
  remove: (id: number, token: string) => apiRequest<void>(`/api/exercer/${id}`, { method: "DELETE", token }),
}

export const consulterApi = {
  list: (token: string) => apiRequest<ConsulterDto[]>("/api/consulter/list", { token }),
  byUser: (userId: number, token: string) =>
    apiRequest<ConsulterDto[]>(`/api/consulter/user/${userId}`, { token }),
  byArticle: (articleId: number, token: string) =>
    apiRequest<ConsulterDto[]>(`/api/consulter/article/${articleId}`, { token }),
  countByArticle: (articleId: number, token: string) =>
    apiRequest<{ views: number }>(`/api/consulter/article/${articleId}/count`, { token }),
  countByUser: (userId: number, token: string) =>
    apiRequest<{ articlesConsultes: number }>(`/api/consulter/user/${userId}/count`, { token }),
  create: (payload: ConsulterCreateDto, token: string) =>
    apiRequest<ConsulterDto>("/api/consulter", { method: "POST", body: payload, token }),
  remove: (id: number, token: string) => apiRequest<void>(`/api/consulter/${id}`, { method: "DELETE", token }),
}

export const logApi = {
  connexions: (token: string) => apiRequest<LogConnexionDto[]>("/api/log-connexion/list", { token }),
  activites: (token: string) => apiRequest<LogActiviteDto[]>("/api/log-activite/list", { token }),
}

