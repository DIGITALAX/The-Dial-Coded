const useNotifications = () => {

    const getNotifications = async (): Promise<void> => {
        try {

        } catch (err: any) {
            console.error(err.message)
        }
    }

    return {getNotifications}
};

export default useNotifications;
