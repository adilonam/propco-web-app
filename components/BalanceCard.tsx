"use client"

import Image, { StaticImageData } from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'next/navigation'

import { useToast } from "@/components/ui/use-toast"












type BalanceCardProps = {
  balance: number;
  logoSrc: StaticImageData;
  currency: string;
};


interface FormValues {
  email: string;
  cryptoAddress: string;
  phone: string;
}





const BalanceCard: React.FC<BalanceCardProps> = ({ balance, logoSrc, currency }) => {


  const params = useParams<{ id: string }>()

  const id: BigInt = BigInt(params?.id as string || "0")

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    cryptoAddress: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
  });


  const { toast } = useToast()

  const formik = useFormik<FormValues>({
    initialValues: {
      email: 'example@example.com',
      cryptoAddress: '',
      phone: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/claim-request', { ...values, userId: Number(id) });
        if (response.status === 201) {
          // Handle success (show a success message, clear the form, etc.)
          toast({
            description: "Request sent successfully; it must be processed within 48 hours.",
        })
          console.log('Success:', response.data);
        }
      } catch (error) {
        // Handle error (show an error message, etc.)
        console.error('Error:', error);
      }
    },
  });

  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden mt-4">
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 py-5 px-7">
        <div className="w-12 h-12 relative">
          <Image src={logoSrc} alt="Logo" layout="fill" objectFit="contain" />
        </div>
        <div className="ml-4">
          <h2 className="text-gray-800 dark:text-gray-200 text-xl font-semibold">Account Balance</h2>
          <p className="text-gray-600 dark:text-gray-400">{currency}</p>
        </div>
      </div>
      <div className="px-7 pt-7 pb-3">
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">{balance.toFixed(2)}</span>
          <p className='text-xs mt-1' hidden={balance >= parseFloat(process.env.NEXT_PUBLIC_CLAIM_EDGE as string)}>🌟Claim When You Reach {process.env.NEXT_PUBLIC_CLAIM_EDGE}🌟</p>
          <div hidden={balance < parseFloat(process.env.NEXT_PUBLIC_CLAIM_EDGE as string)}>
            <Dialog>
              <DialogTrigger asChild>
                <Button

                  variant="outline"
                  className="bg-green-500 hover:bg-green-600 block mx-auto font-bold py-2 px-4 rounded dark:text-gray-900 text-black mt-2"
                >
                  Claim to crypto address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Claim Request</DialogTitle>
                  <DialogDescription>Claim Your Rewards Now! 🎉</DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                      placeholder="example@example.com"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-600">{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cryptoAddress" className="text-right">
                      Crypto Address
                    </Label>
                    <Input
                      id="cryptoAddress"
                      name="cryptoAddress"
                      value={formik.values.cryptoAddress}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                      placeholder="Cyrpto Addr"
                    />
                    {formik.touched.cryptoAddress && formik.errors.cryptoAddress ? (
                      <div className="text-red-600">{formik.errors.cryptoAddress}</div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                      placeholder="123-456-7890"
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                      <div className="text-red-600">{formik.errors.phone}</div>
                    ) : null}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Send request</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>


        </div>
      </div>
















    </div>
  );
};

export default BalanceCard;
