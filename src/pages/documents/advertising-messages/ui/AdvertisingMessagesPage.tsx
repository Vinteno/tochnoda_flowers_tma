import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { useBackButton } from '@/shared'

export function AdvertisingMessagesPage() {
  const navigate = useNavigate()

  const handleBack = useCallback(() => {
    navigate({ to: '/' })
  }, [navigate])

  useBackButton(handleBack)

  return (
    <article className="prose prose-sm mt-4 px-2 pb-2">
      <h2>СОГЛАСИЕ НА ПОЛУЧЕНИЕ РЕКЛАМЫ</h2>

      <p>
        Настоящим я, в соответствии со ст. 18 ФЗ «О рекламе», даю согласие ООО "ФЛОРИС" на получение сообщений
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
          Я могу в любой момент отказаться от получения рекламы, написав «Стоп» в Telegram @FLORIS_FLOWERS_BOT или
          обратившись по телефону +7 999 999-99-99.
        </li>
      </ol>
    </article>
  )
}
