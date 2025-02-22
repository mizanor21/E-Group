"use server"

export async function updateEmployee(id, data) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(Object.fromEntries(data)),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to update employee")
    }

    return { success: true }
  } catch (error) {
    return { error: "Failed to update employee" }
  }
}

