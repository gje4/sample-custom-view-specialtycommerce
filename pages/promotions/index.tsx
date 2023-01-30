import { useRouter } from 'next/router';
import ErrorMessage from '@components/error';
import Form from '@components/form';
import Loading from '@components/loading';
import { useProductList} from '@lib/hooks';
import { FormData } from '@types';
import { useSession } from '../../context/session';

const ProductInfo = () => {
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const { error, isLoading, mutateList } = useProductList();

    const  product  = {description: "description", xvalue: "xvalue", yvalue: "yvalue",  name: "name", type: "type"}
    const { description,  xvalue, name, yvalue, type } = product ?? {};
    const formData = { description, xvalue, name, yvalue, type };
    const handleCancel = () => router.push('/products');

    const handleSubmit = async (data: FormData) => {
        try {
            const { description,xvalue,yvalue, name, type } = data;
            const apiFormattedData = { description, is_visible: xvalue, name, yvalue, type };

            // Update local data immediately (reduce latency to user)
            mutateList([ {  ...data }], false);

            // Update product details
            await fetch(`/api/promotions/?context=${encodedContext}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiFormattedData),
            });

            // Refetch to validate local data
            mutateList();

            router.push('/products');
        } catch (error) {
            console.error('Error updating the product: ', error);
        }
    };

    if (isLoading ) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Form formData={formData} onCancel={handleCancel} onSubmit={handleSubmit} />
    );
};

export default ProductInfo;
