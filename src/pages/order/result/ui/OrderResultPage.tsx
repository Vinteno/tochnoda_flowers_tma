import { clearPendingOrder, getPendingOrder, openPaymentPage, useOrder } from '@entities/order'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { CreditCard } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { LuArrowLeft, LuCheck, LuLoaderCircle, LuX } from 'react-icons/lu'
import { Button } from '@/components/ui/button'

export function OrderResultPage() {
  const { status: initialStatus, orderId } = useSearch({ from: '/order/result/' })

  const paymentUrl = useMemo(() => {
    const pending = getPendingOrder()
    return pending?.confirmationUrl ?? null
  }, [])
  const navigate = useNavigate()

  // Poll order status when pending
  const { data: order, refetch } = useOrder(orderId)

  // Derive current status from order data or initial status
  const currentStatus = useMemo(() => {
    // If we have order data and initial status is pending, derive from payment_status
    if (order && initialStatus === 'pending') {
      if (order.payment_status === 'paid') {
        return 'success' as const
      }
      if (order.payment_status === 'failed') {
        return 'error' as const
      }
    }
    return initialStatus
  }, [order, initialStatus])

  // Handle status change side effects (navigation, cleanup)
  useEffect(() => {
    if (initialStatus !== 'pending' || !orderId) {
      return
    }

    // When status resolves from pending, update URL and clear pending order
    if (currentStatus === 'success') {
      clearPendingOrder()
      navigate({
        to: '/order/result',
        search: { status: 'success', orderId },
        replace: true,
      })
    }
    else if (currentStatus === 'error') {
      clearPendingOrder()
      navigate({
        to: '/order/result',
        search: { status: 'error', orderId },
        replace: true,
      })
    }
  }, [currentStatus, initialStatus, orderId, navigate])

  // Poll for status updates when pending
  useEffect(() => {
    if (currentStatus !== 'pending' || !orderId) {
      return
    }

    // Poll every 3 seconds
    const interval = setInterval(() => {
      refetch()
    }, 3000)

    // Also refetch when user returns to tab (visibility change)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [currentStatus, orderId, refetch])

  // Cleanup pending order on unmount if success
  useEffect(() => {
    return () => {
      if (currentStatus === 'success') {
        clearPendingOrder()
      }
    }
  }, [currentStatus])

  const isPending = currentStatus === 'pending'
  const isSuccess = currentStatus === 'success'
  const isError = currentStatus === 'error'

  return (
    <div
      className="
        flex flex-1 flex-col items-center justify-center gap-2 px-2 py-12
      "
    >
      {isPending && (
        <LuLoaderCircle className="size-24 animate-spin text-primary" strokeWidth={1.5} />
      )}
      {isSuccess && (
        <LuCheck className="size-24 text-primary" strokeWidth={1.5} />
      )}
      {isError && (
        <LuX className="size-24 text-destructive" strokeWidth={1.5} />
      )}

      <h1 className="mt-1 text-center font-medium text-muted-foreground">
        {isPending && 'Ожидание оплаты...'}
        {isSuccess && 'Заказ оформлен!'}
        {isError && 'Ошибка оформления заказа'}
      </h1>

      <p className="text-center text-sm text-muted-foreground">
        {isPending && (
          <>
            Завершите оплату в открывшемся окне.
            <br />
            Страница обновится автоматически.
          </>
        )}
        {isSuccess && (
          <>
            Номер заказа: #
            {orderId}
          </>
        )}
        {isError && (
          <>Произошла ошибка при оформлении заказа. Попробуйте еще раз.</>
        )}
      </p>

      {!isPending && (
        <Button asChild variant="link">
          <Link to="/">
            <LuArrowLeft strokeWidth={1.5} />
            На главную
          </Link>
        </Button>
      )}

      {isPending && paymentUrl && (
        <Button
          onClick={() => openPaymentPage(paymentUrl)}
          className="mt-2.5"
        >
          <CreditCard strokeWidth={1.5} />
          Открыть страницу оплаты
        </Button>
      )}
    </div>
  )
}
