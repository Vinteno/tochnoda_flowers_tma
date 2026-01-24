import { Link, useSearch } from '@tanstack/react-router'
import { LuArrowLeft, LuCheck, LuX } from 'react-icons/lu'
import { Button } from '@/components/ui/button'

export function OrderResultPage() {
  const { status, orderId } = useSearch({ from: '/order/result/' })

  const isSuccess = status === 'success'

  return (
    <div className="
      flex flex-1 flex-col items-center justify-center gap-2 px-2 py-12
    "
    >
      {isSuccess
        ? (
            <LuCheck className="size-24 text-primary" strokeWidth={1.5} />
          )
        : (
            <LuX className="size-24 text-destructive" strokeWidth={1.5} />
          )}
      <h1 className="mt-1 text-center font-medium text-muted-foreground">
        {isSuccess ? 'Заказ оформлен!' : 'Ошибка оформления заказа'}
      </h1>
      <p className="text-center text-sm text-muted-foreground">
        {isSuccess
          ? (
              <>
                Номер заказа: #
                {orderId}
              </>
            )
          : (
              <>Произошла ошибка при оформлении заказа. Попробуйте еще раз.</>
            )}
      </p>
      <Button asChild variant="link">
        <Link to="/">
          <LuArrowLeft strokeWidth={1.5} />
          На главную
        </Link>
      </Button>
    </div>
  )
}
