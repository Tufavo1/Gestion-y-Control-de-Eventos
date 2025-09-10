import { CurrentUser } from "../DesignSystem";

export default function SettingsTab({ user }: { user: CurrentUser }) {
    return (
        <div>
            <h2>Ajustes</h2>
            <p>Panel de configuración del usuario {user.fullName}</p>
        </div>
    );
}
