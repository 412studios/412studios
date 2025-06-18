import prisma from "@/app/lib/db";

export default async function Users() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return (
    <div>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="p-4 border-b">
            <h3 className="font-semibold">{user.name ?? ""}</h3>
            <p className="text-gray-600">{user.email ?? ""}</p>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
          No users available
        </div>
      )}
    </div>
  );
}
