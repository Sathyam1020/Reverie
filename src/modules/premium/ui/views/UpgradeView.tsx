'use client';

import LoadingState from '@/components/loading-state';
import { authClient } from '@/lib/auth-client';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import PricingCard from '../components/PricingCard';

const UpgradeView = () => {

    const trpc = useTRPC();
    const { data: products } = useSuspenseQuery(
        trpc.premium.getProucts.queryOptions(),
    );
    const { data: currentSubscription } = useSuspenseQuery(
        trpc.premium.getCurrentSubscription.queryOptions(),
    );

    return (
        <div className='flex-1 py-4 px-4 md:px-8 flex-col gap-y-10'>
            <div className='mt-4 flex-1 flex-col flex gap-y-10 items-center'>
                <h5 className='font-medium text-2xl md:text-3xl'>
                    You are on the{" "}
                    <span className='font-semibold text-primary'>
                        {currentSubscription?.name ?? "Free"}
                    </span>{" "}
                    plan 
                </h5>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {
                        products.map((product) => {
                            const isCurrentProduct = currentSubscription?.id === product.id; 
                            const isPremium = !!currentSubscription; 

                            let buttonText = "Upgrade"; 
                            let onClick = () => authClient.checkout({products: [product.id]}); 
                            if(isCurrentProduct) {
                                buttonText = "Manage"; 
                                onClick = () => authClient.customer.portal(); 
                            } else if (isPremium) {
                                buttonText = "Change Plan"; 
                                onClick = () => authClient.customer.portal(); 
                            }
                            return (
                                <PricingCard
                                    key={product.id}
                                    title={product.name}
                                    description={product.description}
                                    price={
                                        product.prices[0].amountType === "fixed" ? product.prices[0].priceAmount / 100 : 0
                                    }
                                    priceSuffix={`/${product.prices[0].recurringInterval}`}
                                    features={product.benefits.map(
                                        (benefit) => benefit.description
                                    )}
                                    variant={
                                        product.metadata?.variant === "highlighted" ? "highlighted" : "default"
                                    }
                                    buttonText={buttonText}
                                    onClick={onClick}
                                    badge={product.metadata?.badge as string | null}
                                /> 
                            ); 
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default UpgradeView;

export const UpgradeViewLoading = () => {
    return (
        <LoadingState
            title='Loading'
            description='This may take a few seconds...'
        />
    )
}

export const UpgradeViewError = () => {
    return (
        <LoadingState
            title='Error loading upgrade view'
            description='There was an error loading the upgrade view. Please try again later.'
        />
    )
}