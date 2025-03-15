import { Pagination, ButtonGroup, IconButton } from '@chakra-ui/react'
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react'

export const CustomPagination = ({ count, pageSize, defaultPage, onPageChange }:
    {
        count: number, pageSize: number, defaultPage: number, onPageChange: (page: number) => void
    }
) => {

    return (
        <Pagination.Root
            count={count}
            pageSize={pageSize}
            defaultPage={defaultPage}
            onPageChange={(page) => {
                onPageChange(page.page)
            }}>
            <ButtonGroup variant="outline" size="md">
                <Pagination.PrevTrigger asChild>
                    <IconButton>
                        <LucideChevronLeft />
                    </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                    render={(page) => (
                        <IconButton variant={{ base: "outline", _selected: "solid" }}>
                            {page.value}
                        </IconButton>
                    )}
                />

                <Pagination.NextTrigger asChild>
                    <IconButton>
                        <LucideChevronRight />
                    </IconButton>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    )
}