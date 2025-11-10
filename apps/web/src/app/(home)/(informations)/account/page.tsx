import { LogoutButton } from "@/features/auth/components/logout-button";
import { getServerSession, type ExtendedUser } from "@/shared/lib/auth.server";
import { redirect } from "next/navigation";

const Account = async () => {
  // Get session from server
  const session = await getServerSession();

  // If no session, redirect to login (this is a backup, middleware should catch this)
  if (!session?.user) {
    redirect("/login");
  }

  const user: ExtendedUser = session.user;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Mon Compte</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace personnel
        </p>
      </div>

      {/* User Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Informations personnelles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Prénom
            </label>
            <p className="text-base">{user.name || "Non renseigné"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nom
            </label>
            <p className="text-base">{user.lastName || "Non renseigné"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-base">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Téléphone
            </label>
            <p className="text-base">{user.phone || "Non renseigné"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Langue préférée
            </label>
            <p className="text-base">{user.preferredLanguage || "fr"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Devise préférée
            </label>
            <p className="text-base">{user.preferredCurrency || "XOF"}</p>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-muted-foreground">Rôle</h3>
          <p className="text-2xl font-semibold mt-2 capitalize">
            {user.role || "user"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
          <p className="text-2xl font-semibold mt-2 capitalize">
            {user.status || "active"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-muted-foreground">
            Dernière connexion
          </h3>
          <p className="text-base mt-2">
            {user.lastLoginAt
              ? new Date(user.lastLoginAt).toLocaleDateString("fr-FR")
              : "Inconnue"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Account;
