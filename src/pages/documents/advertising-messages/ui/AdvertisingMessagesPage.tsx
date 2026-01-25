import { useNavigate } from '@tanstack/react-router'
import { BACK_BUTTON_SKIP_ROUTES, useBackButton } from '@/shared'

export function AdvertisingMessagesPage() {
  const navigate = useNavigate()

  useBackButton({
    navigate,
    skipRoutes: BACK_BUTTON_SKIP_ROUTES,
    fallbackTo: '/',
  })

  return (
    <article className="prose prose-sm mt-4 px-2 pb-2">
      <h2>СОГЛАСИЕ НА ПОЛУЧЕНИЕ РЕКЛАМЫ</h2>

      <p>
        Настоящим я, в соответствии со ст. 18 ФЗ «О рекламе», даю согласие ООО "ЭВЕРГРИН" на получение сообщений
        рекламного и информационного характера (о скидках, акциях, статусе заказа).
      </p>

      <ol>
        <li>
          <strong>Каналы связи:</strong>
          <br />
          <ul>
            <li>Мессенджеры (Telegram, WhatsApp);</li>
            <li>SMS-сообщения;</li>
            <li>Телефонные звонки.</li>
          </ul>
        </li>
        <li>
          <strong>Отказ:</strong>
          <br />
          Я могу в любой момент отказаться от получения рекламы, написав «Стоп» в Telegram @EVERGREEN_KZ или
          обратившись по телефону +7 953 495-87-79.
        </li>
      </ol>
    </article>
  )
}
