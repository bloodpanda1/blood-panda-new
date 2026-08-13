import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { faqs } from '#/constants'
import { CheckCircle2Icon } from 'lucide-react'

export default function FAQs() {
  return (
    <section>
      <Card
        className={'rounded-none border-0 bg-transparent shadow-none ring-0'}
      >
        <CardHeader>
          <CardTitle>
            <h3
              className={
                'text-center text-base md:text-xl lg:text-2xl xl:text-3xl'
              }
            >
              Frequently Asked Questions
            </h3>
          </CardTitle>
        </CardHeader>

        <CardContent className={'mx-auto w-full max-w-xl px-0'}>
          <Accordion type="single">
            {faqs.map((faq) => {
              return (
                <AccordionItem value={faq.id} key={faq.id}>
                  <AccordionTrigger>
                    <h5 className={'text-base font-semibold'}>
                      {faq.question}
                    </h5>
                  </AccordionTrigger>
                  <AccordionContent className={'h-fit'}>
                    <p>{faq.answer}</p>
                    {faq.listItems && (
                      <ul className={'space-y-1'}>
                        {faq.listItems.map((item, index) => (
                          <li key={index} className={'flex items-center gap-2'}>
                            <CheckCircle2Icon className={'size-4'} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {faq.ctaText && (
                      <p className={'mt-2 text-sm font-semibold text-primary'}>
                        {faq.ctaText}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
