import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { useBackButton } from '@/shared'

export function PrivacyPolicyPage() {
  const navigate = useNavigate()

  const handleBack = useCallback(() => {
    navigate({ to: '/cart' })
  }, [navigate])

  useBackButton(handleBack)

  return (
    <article className="prose prose-sm mt-4 px-2 pb-2">
      <h2>СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</h2>

      <p>
        Я, оформляя заказ в сервисе "EverGreen", свободно, своей волей и в своем интересе даю согласие
        {' '}
        <strong>ООО "ЭВЕРГРИН"</strong>
        {' '}
        (ИНН 1685017043, г. Казань, ул. Чистопольская, д. 75) на обработку моих
        персональных данных.
      </p>

      <ol>
        <li>
          <strong>Перечень данных:</strong>
          <ul>
            <li>Фамилия, Имя;</li>
            <li>Номер телефона (мой и Получателя);</li>
            <li>Адрес доставки;</li>
            <li>Данные Telegram-аккаунта (Username, ID);</li>
            <li>История заказов.</li>
          </ul>
        </li>
        <li>
          <strong>Цели обработки:</strong>
          <ul>
            <li>Оформление и исполнение заказа (в т.ч. доставка);</li>
            <li>Связь со мной для уточнения деталей;</li>
            <li>Направление чеков и уведомлений о статусе заказа;</li>
            <li>Контроль качества услуг.</li>
          </ul>
        </li>
        <li>
          <strong>Действия с данными:</strong>
          <br />
          Сбор, запись, хранение, уточнение, использование, удаление. Я согласен на передачу данных (адрес,
          телефон) курьерам исключительно для целей доставки.
        </li>
        <li>
          <strong>Срок и отзыв:</strong>
          <br />
          Согласие действует до момента его отзыва. Я могу отозвать согласие, написав в Telegram
          @EVERGREEN_KZ
        </li>
      </ol>
    </article>
  )
}
