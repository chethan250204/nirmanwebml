import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { getUserByEmail, createUser, getUserById } from "@/lib/database"

const secretKey = process.env.AUTH_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function login(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error("Invalid credentials")
  }

  // Create session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  const session = await encrypt({ userId: user.id, email: user.email, role: user.role, expires })

  // Save the session in a cookie
  const cookieStore = await cookies()
  cookieStore.set("session", session, { expires, httpOnly: true })

  return { user, session }
}

export async function signup(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "owner" | "contractor"
}) {
  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  // Create user
  const user = await createUser({
    ...userData,
    password: hashedPassword,
  })

  // Create session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  const session = await encrypt({ userId: user.id, email: user.email, role: user.role, expires })

  // Save the session in a cookie
  const cookieStore = await cookies()
  cookieStore.set("session", session, { expires, httpOnly: true })

  return { user, session }
}

export async function logout() {
  // Destroy the session
  const cookieStore = await cookies()
  cookieStore.set("session", "", { expires: new Date(0) })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) return null

  try {
    const payload = await decrypt(session)
    return payload
  } catch (error) {
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  try {
    const user = await getUserById(session.userId)
    return user
  } catch (error) {
    return null
  }
}
