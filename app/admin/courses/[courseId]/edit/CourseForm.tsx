"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { courseActionEdit } from "./course.action";
import { CourseFormSchema } from "./course.schema";

export type CourseFormProps = {
  defaultValue?: CourseFormSchema & {
    id: string;
  };
};

export const CourseForm = ({ defaultValue }: CourseFormProps) => {
  const form = useZodForm({
    schema: CourseFormSchema,
    defaultValues: defaultValue,
  });
  const router = useRouter();

  return (
    <Form
      form={form}
      onSubmit={async (values) => {
        if (defaultValue?.id) {
          console.log(7, "Updating course...");

          const result = await courseActionEdit({
            courseId: defaultValue.id,
            data: values,
          });

          console.log(7, "data =>", result?.data);
          console.log(7, "serverError =>", result?.serverError);
          console.log(7, "validationErrors =>", result?.validationErrors);

          if (result?.data) {
            toast.success(result.data);
            router.push(`/admin/courses/${defaultValue.id}`);
            router.refresh();
            return;
          }

          if (result?.validationErrors) {
            toast.error("Some error occurred", {
              description: `Error with ${
                Object.keys(result?.validationErrors)[0]
              }`,
            });
            return;
          }

          toast.error("Some error occurred", {
            description: result?.serverError as string,
          });
          return;
        } else {
          // create course
        }
      }}
    >
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <Input placeholder="https://googleimage.com" {...field} />
            </FormControl>
            <FormDescription>
              Host and use an image. You can use
              <Link href="https://imgur.com"> Imgur</Link> to host your image.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="NextReact" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="presentation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Presentation</FormLabel>
            <FormControl>
              <Textarea placeholder="## Some title" {...field} />
            </FormControl>
            <FormDescription>Markdown is supported.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">Submit</Button>
    </Form>
  );
};
