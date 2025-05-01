import { revalidatePath } from "next/cache"

export async function revalidateContent(path = "/") {
  revalidatePath(path)
}
